const db = require("./db")

const token = db.model('token', { phone: String, token: String })

module.exports = token
