
export default (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Big Error: " + err.message })
}