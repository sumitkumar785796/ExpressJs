const bcrypt = require("bcrypt")
const { validationResult } = require('express-validator');
const AuthForm = require("../models/auth.models")
const { RegistrationRules, MailRules, SignInRules, UpdationRules } = require("../helpers/auth.validator")
const generateToken = require("../utils/tokengenerator")
const mailer = require("../config/emailverfiy")
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
        const msg = `<h3>Dear ${fname} ${lname}</h3><br/>Thanks for registering for an account on My Account! Before we get started, we just need to confirm that this is you. Click below to verify your email address <br/> <a href="http://localhost:3006/authverify/${sendData._id}" style="background-color:black;color:white;text-decoration:none;margin:200px;font-size:30px;">Verify Email</a>`;
        mailer.emailMail(email, 'Mail Verification', msg);
        return res.status(201).json({ message: 'Successfully Registration please verify your mail...', data: sendData });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.MailVerification = async (req, res) => {
    // Run validation rules
    await Promise.all(MailRules.map((Rules) => Rules.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { id } = req.params
    try {
        const userData = await AuthForm.findOne({ _id: id })
        if (!userData) {
            return res.status(400).json({ message: 'User is not Found' })
        }
        if (userData.is_verified === 1) {
            return res.status(200).json({ message: 'Your mail is already verified...' })
        }
        const verify = await AuthForm.findByIdAndUpdate({ _id: id }, {
            $set: {
                is_verified: 1
            }
        })
        return res.status(201).json({ message: 'Mail has been verified successfully...', data: verify })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
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
        if (user.is_verified == 0) {
            return res.status(400).json({ message: 'User is not verified...' })
        } else if (user && (await user.matchPassword(password))) {
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
    const { fname, lname, email, mobile, password, repassword } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const Updateddata = await AuthForm.findByIdAndUpdate({
            _id: req.user.user._id
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