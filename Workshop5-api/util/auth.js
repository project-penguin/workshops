require('dotenv').config()

export const checkAuth = (req) => req.headers.auth === process.env.AUTH_PASS