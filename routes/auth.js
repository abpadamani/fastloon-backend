const e = require("express")
const OTPGen = require("../tools/opt")
const sendSMS = require("../tools/sms")
const TokeGen = require("../tools/token")
const otpModel = require("../model/opt.model")
const userModel = require("../model/user.model")
const tokenModel = require("../model/token.model")

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

r.post("/verify", async (req, res) => {

    let b = req.body;
    if (!b.phone || !b.otp) {
        res.send({
            status: false,
            massage: "phone or otp not found"
        })
        return
    }

    let uPhone = b.phone;
    let uOtp = b.otp;

    let result = await otpModel.deleteOne({ phone: uPhone, otp: uOtp })

    if (result.deletedCount != 1) {
        res.send({
            status: false,
            massage: "Invalid OTP"
        })
        return
    }

    let thisPhoneExist = await userModel.exists({ phone: uPhone })

    let r = await new Promise(async res => {
        if (thisPhoneExist === null) {
            // if user is new

            // create new user
            let t = new userModel({
                phone: uPhone,
                name: "",
                address: "",
                gender: "",
                profile: "",
                new: true
            })
            t.save().then(() => {
                // create new user sucessfull

                // make token
                let token = TokeGen()
                let t2 = new tokenModel({
                    phone: uPhone,
                    token
                })
                t2.save().then(() => res({
                    status: true,
                    massage: "success",
                    token,
                    new: true
                })).catch(() => res({
                    status: false,
                    massage: "token error"
                }))
            }).catch(() => res({
                // create new user error
                status: false,
                massage: "internal server error"
            }))
        } else {
            // user phone data find
            let result = await userModel.findOne({ phone: uPhone })
            // if error
            if (!result) {
                res({
                    status: false,
                    massage: "internal server error"
                });
                return;
            };

            // token gen
            let token = TokeGen()
            let t2 = new tokenModel({
                phone: uPhone,
                token
            })
            t2.save().then(() => res({
                status: true,
                massage: "success",
                token,
                new: result.new
            })).catch(() => res({
                status: false,
                massage: "token error"
            }))
        }
    })

    res.send(r)


})

module.exports = r
