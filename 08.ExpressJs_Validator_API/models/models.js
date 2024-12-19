const mongoose = require("mongoose")
const simpleSchema = new mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address",
        ],
    },
    mobile: {
        type: String,
        trim: true,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})
const simpleForm = mongoose.model('simpleForm', simpleSchema)
module.exports = simpleForm