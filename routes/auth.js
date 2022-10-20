const e = require("express")
const OTPGen = require("../tools/opt")
const sendSMS = require("../tools/sms")
const otpModel = require("../model/opt.model")

let r = e.Router()

r.post("/", async (req, res) => {

    if (!req.body.phone) {
        res.send({
            status: false,
            massage: "phone not found"
        })
        return
    }

    let otp = OTPGen()

    let uPhone = req.body.phone

    let ifNumberExist = await otpModel.exists({ phone: uPhone })

    let cNumber = await new Promise(async (res) => {
        if (ifNumberExist === null) {
            const optIn = new otpModel({ phone: uPhone, otp: otp });
            await optIn.save().catch(_e => res(false))
            res(true)
        } else {
            await otpModel.updateOne({ phone: uPhone }, { otp: otp }).catch(_e => res(false))
            res(true)
        }
    })

    sendSMS(uPhone, `Your OTP Is ${otp}`);

    if (cNumber) {
        res.send({
            status: true,
            massage: "otp send successfull"
        })
    } else {
        res.send({
            status: false,
            massage: "internal server error"
        })
    }

})

module.exports = r
