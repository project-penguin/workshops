import { checkAuth } from "../../util/auth"
import { createProducts } from "../../controller/products"

export default async function handler(req, res) {
    try {
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
        if (!req.body || !req.body.products) throw new Error('bad body')
        const id = await createProducts(req.body.products)
        console.log(id)
        return res.status(200).json({ id, message: "Successfully added products" })
    }
}