const bcrypt = require("bcrypt")
const { validationResult } = require('express-validator');
const AuthForm = require("../models/auth.models")
const resetForm = require("../models/otp.models")
const { RegistrationRules, MailRules, SignInRules, UpdationRules } = require("../helpers/auth.validator")
const generateToken = require("../utils/tokengenerator")
const mailer = require("../config/emailverfiy")
const { generateOtp } = require("../utils/otp")
exports.Signup = async (req, res) => {
    // Run validation rules
    await Promise.all(RegistrationRules.map((Rules) => Rules.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { fname, lname, email, mobile, password, repassword } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        // Generate OTP
        const { otp, expiresAt } = generateOtp()
        // Create user with OTP and expiration
        const sendData = await AuthForm.create({
            fname, lname, email, mobile, password: hashedPassword, repassword, otp, otpExpiresAt: expiresAt,
        })

        // Send OTP via email or SMS
        const msg = `<h3>Dear ${fname} ${lname}</h3>
                     <p>Your OTP is: <strong>${otp}</strong></p>
                     <p>This OTP is valid for 5 minutes.</p>`;
        mailer.emailMail(email, 'OTP Verification', msg)
        return res.status(201).json({ message: 'Successfully registered. Please verify your account using the OTP sent to your email...', data: sendData })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.VerifyOtp = async (req, res) => {
    const { email, otp } = req.body

    try {
        // Find user by email
        const user = await AuthForm.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        // Check if the user is already verified
        if (user.is_verified) {
            return res.status(200).json({ message: "Account is already verified." })
        }

        // Check if OTP is expired
        if (user.otpExpiresAt < Date.now()) {
            // Generate a new OTP since the current one is expired
            const { otp: newOtp, expiresAt } = generateOtp()
            user.otp = newOtp
            user.otpExpiresAt = expiresAt
            await user.save()

            // Send new OTP via email or SMS
            const msg = `<h3>Dear ${user.fname} ${user.lname}</h3>
                         <p>Your new OTP is: <strong>${newOtp}</strong></p>
                         <p>This OTP is valid for 5 minutes.</p>`;
            mailer.emailMail(user.email, 'OTP Regeneration', msg)

            return res.status(400).json({
                message: "OTP has expired. A new OTP has been sent to your email.",
            })
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." })
        }

        // Mark user as verified
        user.is_verified = true
        user.otp = null // Clear OTP after successful verification
        user.otpExpiresAt = null
        await user.save()

        return res.status(200).json({
            message: "OTP verified successfully. Account is now verified."
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
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
    const hashedPassword = await bcrypt.hash(password, 10)
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
exports.ForgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        // Find user by email
        const user = await AuthForm.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        // Check if user is verified
        if (!user.is_verified) {
            return res.status(400).json({ message: "User is not verified. Please verify your email first." })
        }

        // Find existing OTP entry for the user
        const resetOtpEntry = await resetForm.findOne({ userID: user._id })

        const currentTime = new Date()

        // Check if OTP exists and if it has expired
        if (resetOtpEntry && resetOtpEntry.resetotpExpiresAt && currentTime < new Date(resetOtpEntry.resetotpExpiresAt)) {
            // OTP is still valid, resend the existing OTP
            const msg = `<h3>Dear ${user.fname} ${user.lname}</h3>
                         <p>Your OTP for resetting your password is: <strong>${resetOtpEntry.resetOtp}</strong></p>
                         <p>This OTP is valid for 5 minutes.</p>`;
            mailer.emailMail(user.email, 'Password Reset OTP', msg)

            return res.status(200).json({
                message: "OTP has been resent to your email for password reset.",
            })
        }

        // If OTP has expired or doesn't exist, generate a new OTP
        const { otp, expiresAt } = generateOtp()

        // Save the new OTP to the database
        if (resetOtpEntry) {
            // Update existing OTP entry
            resetOtpEntry.resetOtp = otp
            resetOtpEntry.resetotpExpiresAt = expiresAt
            await resetOtpEntry.save()
        } else {
            // Create a new OTP entry for the user
            const newResetOtpEntry = new resetForm({
                userID: user._id,
                resetOtp: otp,
                resetotpExpiresAt: expiresAt,
            })
            await newResetOtpEntry.save()
        }

        // Send the new OTP via email
        const msg = `<h3>Dear ${user.fname} ${user.lname}</h3>
                     <p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
                     <p>This OTP is valid for 5 minutes.</p>`;
        mailer.emailMail(user.email, 'Password Reset OTP', msg)

        return res.status(200).json({
            message: "OTP has been sent to your email for password reset.",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
        })
    }
}
exports.VerifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    console.log(newPassword)
    try {
        // Find user by email
        const user = await AuthForm.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        // Find the reset OTP entry for the user
        const resetOtpEntry = await resetForm.findOne({ userID: user._id })

        if (!resetOtpEntry) {
            return res.status(400).json({ message: "No OTP request found for this user." })
        }

        // Check if OTP has expired
        if (resetOtpEntry.resetotpExpiresAt < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            })
        }

        // Check if OTP matches
        if (resetOtpEntry.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update the user's password and clear OTP fields
        user.password = hashedPassword
        resetOtpEntry.resetOtp = null // Clear OTP after successful reset
        resetOtpEntry.resetotpExpiresAt = null // Clear OTP expiration time
        await user.save()
        await resetOtpEntry.save() // Clear the OTP entry

        return res.status(200).json({ message: "Password has been successfully reset." })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
        })
    }
}


