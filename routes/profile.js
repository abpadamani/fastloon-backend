const e = require("express")
const r = e.Router()

r.post("/", (req, res) => {
    // todo
    res.send({
        status: false,
        massage: "daata upoad todo"
    })
})

r.post("/image", (req, res) => {
    // todo
    res.send({
        status: false,
        massage: "photo upload todo"
    })
})

module.exports = r
