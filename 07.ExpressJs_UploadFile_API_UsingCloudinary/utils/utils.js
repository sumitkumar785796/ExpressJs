require("dotenv").config()

// Retrieve environment variables with default fallback
const PORT = process.env.PORT || 3000 // Default to port 3000 if PORT is not defined
const MONGODB = process.env.MONGODB
const cloud_name= process.env.CLOUDINARY_CLOUD_NAME
const api_key= process.env.CLOUDINARY_API_KEY
const api_secret= process.env.CLOUDINARY_SECRET_KEY

if (!MONGODB) {
    throw new Error("MONGODB connection string is not defined in the environment variables.")
}

module.exports = {
    PORT,
    MONGODB,
    cloud_name,
    api_key,
    api_secret,
}
