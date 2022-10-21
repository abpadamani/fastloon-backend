const db = require("./db")

const user = db.model('user', {
    phone: { type: String, index: true },
    name: String,
    address: String,
    gender: String,
    profile: String,
    new: Boolean
})

module.exports = user

