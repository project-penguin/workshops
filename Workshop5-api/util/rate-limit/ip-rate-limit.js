import { initRateLimit } from './rate-limit'
import { upstashRest } from './upstash'

export default function getIP(request) {
  const xff = request.headers['x-forwarded-for']
  return xff ? xff.split(',')[0] : '127.0.0.1'
}

export const ipRateLimit = initRateLimit((request, response) => ({
  id: `ip:${getIP(request)}`,
  count: increment,
  limit: 5,
  timeframe: 30,
}))

const increment = async ({ response, key, timeframe }) => {
  // Latency logging
  const start = Date.now()

  const results = await upstashRest(
    [
      ['INCR', key],
      ['EXPIRE', key, timeframe],
    ],
    { pipeline: true }
  )
  // Temporal logging
  const latency = Date.now() - start
  if(!response.headers) response.headers = {}
  response.headers['x-upstash-latency'] = `${latency}`

  return results[0].result
}
