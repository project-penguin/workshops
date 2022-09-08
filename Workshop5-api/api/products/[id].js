import { getProducts, getAllProducts } from "../../controller/products"
import { checkAuth } from "../../util/auth"
import { checkId } from "../../util/validation"
import { ipRateLimit } from "../../util/rate-limit/ip-rate-limit"

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
        if (!checkAuth(req)) throw new Error('Failed to authenticate')
        await ipRateLimit(req, res)
        if (res.statusCode !== 200) return res
        const id = req.query.id
        if (!id) throw new Error('No query params found')
        if(!checkId(id)) throw new Error(`Invalid id provided: ${id}`)
        const results = await getProducts(id)
        if (results === null) return res.status(404).json({
            message: `Products with id ${id} could not be found`
        })
        res.status(200).json({
            message: "Successfully retrieved products",
            data: results
        })
    },
}