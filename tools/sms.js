
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = (phone, body) => {

    if (!(process.env.ESMS === "true")) { console.log(`\n----------\nMassage\nTo: ${phone}\n${body}\n----------`); return }

    client.messages
        .create({ body, from: '+15643334597', to: phone })
        .catch((e) => console.log(e));
}

module.exports = sendSMS
