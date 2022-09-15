import express from "express"
import { createProducts } from "../../controller/products"
import { checkAuth } from "../../util/auth"
import rateLimit from "../../util/rate-limit"
import app from "../../util/app"
import errorHandler from "../../util/error"

const router = express.Router()

router.get("/", (req, res) => {
    return res.status(404).json({ message: "Try adding an ID to your url: /api/products/62fa4be..." })
})

router.post("/", checkAuth, rateLimit, async (req, res, next) => {
    if (!req.body || !req.body.products) return res.status(400).json({ message: "Could not read products, did you include your products in you request body?" })
    try {
        const id = await createProducts(req.body.products)
        return res.status(200).json({ id, message: "Successfully added products" })
    } catch(err) {
        next(err)
    }
})

app.use('/api/products', router)

app.use(errorHandler)

export default async function handler(req, res) {
    return app.handle(req, res)
}