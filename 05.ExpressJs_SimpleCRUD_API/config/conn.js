const mongoose = require("mongoose")
const { MONGODB } = require("../utils/utils")

exports.connDB = async () => {
    try {
        await mongoose.connect(MONGODB)
        console.log("MongoDB connected...")
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1) // Exit process with failure
    }
}
