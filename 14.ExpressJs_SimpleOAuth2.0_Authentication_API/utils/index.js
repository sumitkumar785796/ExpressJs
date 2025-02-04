require("dotenv").config()
const port = process.env.PORT || 3001
const mongodb = process.env.MONGODB
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleclientSecret= process.env.GOOGLE_CLIENT_SECRET
const googlecallbackURL= process.env.CALLBACK_URL
if (!mongodb) {
    throw new Error("Mongodb connection string is not defined in the environment variables.")
}
module.exports = {
    port, mongodb,googleClientId,googleclientSecret,googlecallbackURL
}