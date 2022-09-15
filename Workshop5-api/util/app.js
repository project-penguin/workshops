import express from "express"
import cors from "cors"
const app = express()

app.use(express.json({ limit: "40MB"}))
app.use(cors())

export default app