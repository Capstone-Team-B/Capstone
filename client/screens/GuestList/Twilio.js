const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')("AC8b2436703aafc7c8fe72ef54b0e3151b", "41f9dfc029adeefcb22417ff511e13c8");


client.messages
    .create({
        body: 'test',
        from: '+18335922175',
        to: '+17204965728'
    })
    .then(message => console.log(message.sid));