require("dotenv").config()

// Retrieve environment variables with default fallback
const PORT = process.env.PORT || 3000 // Default to port 3000 if PORT is not defined
const MONGODB = process.env.MONGODB

if (!MONGODB) {
    throw new Error("MONGODB connection string is not defined in the environment variables.")
}

module.exports = {
    PORT,
    MONGODB
}
