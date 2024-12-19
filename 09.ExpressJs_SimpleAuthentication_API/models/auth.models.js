const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const AuthSchema = new mongoose.Schema({
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
        required:true
    }
}, {
    timestamps: true
})
AuthSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

AuthSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
const AuthForm = mongoose.model('AuthForm', AuthSchema)
module.exports = AuthForm