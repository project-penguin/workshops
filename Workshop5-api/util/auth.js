require('dotenv').config()

export const checkAuth = (req, res, next) => {
    console.log('authing')
    if(req.headers.auth !== process.env.AUTH_PASS) {
        return res.status(401).json({ message: 'Failed to authenticate' })
    }
    next()
}
