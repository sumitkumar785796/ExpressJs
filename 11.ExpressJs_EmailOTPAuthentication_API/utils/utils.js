require("dotenv").config()
const PORT = process.env.PORT
const MONGODB = process.env.MONGODB
const smtphost = process.env.SMTP_HOST
const smtpport = process.env.SMTP_PORT
const smtpmail = process.env.SMTP_MAIL
const smtppass = process.env.SMTP_PASS
module.exports = {
    PORT,
    MONGODB,
    smtphost,
    smtpport,
    smtpmail,
    smtppass,
}