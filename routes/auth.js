const e = require("express")
const OTPGen = require("../tools/opt")
const sendSMS = require("../tools/sms")
let r = e.Router()

r.post("/", (req, res) => {

    if (!req.body.phone){
        res.send({
            status: false,
            massage: "phone not found"
        })
        return
    }

    let otp = OTPGen()

    let uPhone = req.body.phone

    sendSMS(uPhone, `Your OTP Is ${otp}`);

    res.send({
        status: true,
        massage: "success"
    })
})

module.exports = r
