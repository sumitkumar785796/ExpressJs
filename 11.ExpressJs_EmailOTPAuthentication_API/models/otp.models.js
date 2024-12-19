const mongoose = require("mongoose")
const resetpasswordSchema = new mongoose.Schema({
   userID: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'AuthOTPForm', // Reference the User collection
        required: true // Ensures that every OTP is linked to a user
    },
    resetOtp: {
        type: String
    },
    resetotpExpiresAt: {
        type: Date
    },
}, {
    timestamps: true
})

const resetForm = mongoose.model('resetForm', resetpasswordSchema)
module.exports = resetForm