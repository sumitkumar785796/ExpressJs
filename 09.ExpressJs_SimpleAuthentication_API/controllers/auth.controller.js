const bcrypt = require("bcrypt")
const { validationResult } = require('express-validator');
const AuthForm = require("../models/auth.models")
const { RegistrationRules, SignInRules, UpdationRules } = require("../helpers/auth.validator")
const generateToken = require("../utils/tokengenerator")
exports.Signup = async (req, res) => {
    // Run validation rules
    await Promise.all(RegistrationRules.map((Rules) => Rules.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { fname, lname, email, mobile, password, repassword } = req.body

    try {
        const sendData = await AuthForm.create({
            fname, lname, email, mobile, password, repassword
        })
        return res.status(201).json({
            message: "Signup Successfully...",
            data: sendData
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.Signin = async (req, res) => {
    // Run validation rules
    await Promise.all(SignInRules.map((Rules) => Rules.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        const user = await AuthForm.findOne({ email })
        if (user && (await user.matchPassword(password))) {
            return res.status(200).json({
                message: "User SignIn successfully...",
                data: user,
                token: generateToken(user),
                tokenType: "Bearer"
            })
        } else {
            return res.status(401).json({
                message: "Your authentication information is incorrect. Please try again."
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.AccessProfile = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Your Profile",
            data: req.user.user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.UpdateProfile = async (req, res) => {
    // Run validation rules
    await Promise.all(UpdationRules.map((Rules) => Rules.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const user = req.user.user._id;
    const { fname, lname, email, mobile, password, repassword } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const Updateddata = await AuthForm.findByIdAndUpdate({
            _id: user
        }, {
            fname, lname, email, mobile, password: hashedPassword, repassword
        }, {
            new: true
        })
        return res.status(200).json({
            message: "Your Profile is Updated Successfully...",
            data: Updateddata
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.DeleteProfile = async (req, res) => {
    const user = req.user.user._id;
    try {
        const Updateddata = await AuthForm.findByIdAndDelete({
            _id: user
        })
        return res.status(200).json({
            message: "Your Profile Deleted Successfully...",
            data: Updateddata
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.ViewAll = async (req, res) => {
    try {
        const view = await AuthForm.find()
        if (view.length === 0) {
            return res.status(404).json({
                message: "No Data found."
            })
        }
        res.status(200).json({
            message: "View All User:" + view.length,
            data: view,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}