const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const AuthotpSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim: true,
        required: true
    },
    lname: {
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
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    is_verified: {
        type: Number,
        default: 0
    },
    otp: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
}, {
    timestamps: true
})


AuthotpSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
const AuthForm = mongoose.model('AuthOTPForm', AuthotpSchema)
module.exports = AuthForm