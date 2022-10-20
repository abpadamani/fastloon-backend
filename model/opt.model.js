const db = require("./db")

const otp = db.model('otp', { phone: String, otp: String })

module.exports = otp
