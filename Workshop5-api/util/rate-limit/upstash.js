import axios from 'axios'

async function upstash({
  url,
  token,
  ...init
}) {
  const res = await axios({
    url,
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...init.headers,
    },
  })

  if (res.data) {
    return res.data
  } else {
    throw new Error(
      `Upstash failed with (${res.status}): ${
        typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2)
      }`
    )
  }
}

export async function upstashRest(
  args,
  options
) {
  const domain = process.env.UPSTASH_REST_API_DOMAIN
  const token = process.env.UPSTASH_REST_API_TOKEN

  if (!domain || !token) {
    throw new Error('Missing required Upstash credentials of the REST API')
  }

  return upstash({
    token,
    url: `${domain}${options?.pipeline ? '/pipeline' : ''}`,
    method: 'POST',
    data: JSON.stringify(args),
  })
}