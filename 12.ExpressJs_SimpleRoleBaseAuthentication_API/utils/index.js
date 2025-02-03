require("dotenv").config()
const port = process.env.PORT || 3001
const mongodb = process.env.MONGODB
if(!mongodb){
    throw new Error("Mongodb connection string is not defined in the environment variables.")
}
module.exports = {
    port,mongodb
}