import { upstashRest } from './upstash'

const config = {
  limit: 5,
  timeframe: 30
}

export default async (req, res, next) => {
  const ip = getIP()
  const { key, reset } = getKey(config.timeframe, ip)
  try {
    const checkCount = await increment(res, key, config.timeframe)
    const remaining = config.limit - checkCount
    setHeaders(res, config.limit, remaining, reset)
    if(remaining < 0) return res.status(429).json({ message: 'API rate limit exceeded'})
    else next()
  } catch (err) {
    console.error('Rate limit failed with:', err)
    return next()
  }
}

function getIP(request) {
  const xff = request?.headers['x-forwarded-for']
  return xff ? xff.split(',')[0] : '127.0.0.1'
}

function getKey(timeframe, id) {
  const time = Math.floor(Date.now() / 1000 / timeframe)
  return {
    key: `${id}:${time}`,
    reset: (time + 1) * timeframe
  } 
}

const increment = async (response, key, timeframe) => {
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
  response.setHeader('x-upstash-latency', `${latency}`)
  const count = results[0].result
  if (typeof count !== "number") return 0
  return count
}

function setHeaders(response, limit, remaining, reset) {
  response.setHeader('X-RateLimit-Limit', `${limit}`)
  response.setHeader('X-RateLimit-Remaining', `${remaining < 0 ? 0 : remaining}`)
  response.setHeader('X-RateLimit-Reset', `${reset}`)
}
