import { checkAuth } from "../../util/auth"
import { createProducts } from "../../controller/products"
import { ipRateLimit } from "../../util/rate-limit/ip-rate-limit"

export default async function handler(req, res) {
    try {
        await ipRateLimit(req, res)
        if (res.statusCode !== 200) return res
        return await handlers[req.method](req, res)
    } catch(err) {
        return res.status(400).json({ message: err.message })
    }
}

const handlers = {
    GET(req, res) {
        throw new Error('Try adding an ID to your url: /api/products/62fa4be...')
    },
    async POST(req, res) {
        if (!checkAuth(req)) throw new Error('Failed to authenticate')
        if (!req.body || !req.body.products) throw new Error('Could not read products')
        const id = await createProducts(req.body.products)
        return res.status(200).json({ id, message: "Successfully added products" })
    }
}