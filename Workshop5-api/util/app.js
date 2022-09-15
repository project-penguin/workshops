import express from "express"
import cors from "cors"

const app = express()

app.use(express.json({ limit: "200mb" }))
app.use(cors())
// app.options(cors())

export default app