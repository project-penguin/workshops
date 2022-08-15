import { getProducts, getAllProducts } from "../../controller/products"

export default async function handler(req, res) {
    try {
        if (handlers[req.method] === undefined) return res.status(404).json({ message: "Method not available" })
        return await handlers[req.method](req, res)
    } catch(err) {
        return res.status(400).json({ message: err.message })
    }
}

const handlers = {
    async GET(req, res) {
        if (!req.query.id) throw new Error('No query params found')
        const results = await getProducts(req.query.id)
        res.status(200).json({
            message: "Successfully retrieved products",
            data: results
        })
    },
}