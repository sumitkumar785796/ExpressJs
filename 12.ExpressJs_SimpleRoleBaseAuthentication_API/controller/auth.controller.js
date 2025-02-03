const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require('express-validator')
const authModel = require("../model/auth.model")
const { SignUpRules, SignInRules } = require("../helpers/auth.validator")
const jwtsecretKey = require("../utils/token")
exports.SignUp = async (req, res) => {
    try {
        // Run validation rules
        await Promise.all(SignUpRules.map((Rules) => Rules.run(req)))
        // Check for validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { username, password, role } = req.body
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await authModel.create({
            username, password: hashedPassword, role
        })
        return res.status(201).json({
            message: `${username} is Successfully Registration...`,
            data: newUser,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error...",
            data: error.message,
            success: false
        })
    }
}
exports.SignIn = async (req, res) => {
    try {
        // Run validation rules
        await Promise.all(SignInRules.map((Rules) => Rules.run(req)))
        // Check for validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { username, password } = req.body
        // Find user in the database
        const existingUser = await authModel.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({
                message: 'Your authentication information is incorrect. Please try again.',
                success: false
            });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Your authentication information is incorrect. Please try again.',
                success: false
            });
        }

        //jwt token generated
        const tokengenerator = jwt.sign(
            {user:existingUser},jwtsecretKey,{expiresIn:"1hr"}
        )

        res.status(200).json({
            message: `${username} is Successfully SignIn...`,
            data: existingUser,
            token:`Bearer ${tokengenerator}`,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error...",
            data: error.message,
            success: false
        })
    }
}