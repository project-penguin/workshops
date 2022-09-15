import express from "express"
import { getProducts, getAllProducts } from "../../controller/products"
import { checkId } from "../../util/validation"
import rateLimit from "../../util/rate-limit"
import app from "../../util/app"
import errorHandler from "../../util/error"

const router = express.Router()

router.get("/", rateLimit, async (req, res, next) => {
    const id = req.query.id
    if (!id) next(Error('Could not parse query param'))
    if(!checkId(id)) return res.status(403).json({
        message: `Invalid id provided: ${id}`
    })
    try {
        const results = await getProducts(id)
        if (results === null) return res.status(404).json({
            message: `Products with id ${id} could not be found`
        })
        return res.status(200).json({
            message: "Successfully retrieved products",
            data: results
        })
    } catch(err) {
        next(err)
    }
})

app.use('/api/products/:id', router)

app.use(errorHandler)

export default async function handler(req, res) {
    return app.handle(req, res)
}