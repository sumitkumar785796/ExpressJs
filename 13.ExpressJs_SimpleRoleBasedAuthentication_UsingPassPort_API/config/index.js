const mongoose = require("mongoose")
const { mongodb } = require("../utils")
exports.connDB = async()=>{
    try {
       await mongoose.connect(mongodb)
       console.log("MongoDB connected...")
    } catch (error) {
        console.error("MongoDB connection failed...",error.message)
        process.exit(1)
    }
}