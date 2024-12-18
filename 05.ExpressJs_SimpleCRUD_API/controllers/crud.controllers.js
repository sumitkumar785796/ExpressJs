const CRUDForm = require("../models/crud.models")
const mongoose = require("mongoose")
exports.creates = async (req, res) => {
    try {
        const { fname, lname, email } = req.body
        // Validate email presence
        if (!email) {
            return res.status(422).json({
                message: "Email is mandatory."
            })
        }
        // Check if the email already exists
        const existEmail = await CRUDForm.findOne({ email })
        if (existEmail) {
            return res.status(422).json({
                message: "Email already exists."
            })
        }
        // Create a new user
        const created = await CRUDForm.create({ fname, lname, email })
        // Respond with success
        return res.status(201).json({
            message: "User created successfully.",
            data: created
        })
    } catch (error) {
        // Handle any internal server errors
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.read = async (req, res) => {
    try {
        // Fetch all users
        const users = await CRUDForm.find()
        // Check if users exist
        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found."
            })
        }
        // Respond with users
        return res.status(200).json({
            message: "Users retrieved successfully.",
            data: users
        })
    } catch (error) {
        // Handle internal server errors
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.Update = async (req, res) => {
    try {
        const { id } = req.params
        const { fname, lname, email } = req.body

        // Validate if `id` is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID provided."
            })
        }
        // Validate email
        if (!email) {
            return res.status(422).json({
                message: "Email is mandatory."
            });
        }

        // Check if the user exists before updating
        const userExists = await CRUDForm.findById(id)
        if (!userExists) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        // Perform the update
        const updatedUser = await CRUDForm.findByIdAndUpdate(
            id,
            { fname, lname, email },
            { new: true } // Return the updated document
        )

        // Respond with the updated user
        return res.status(200).json({
            message: "User updated successfully.",
            data: updatedUser
        })
    } catch (error) {
        // Catch and return any internal server errors
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.Delete = async (req, res) => {
    try {
        const { id } = req.params

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID provided."
            })
        }

        // Check if the user exists
        const user = await CRUDForm.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        // Delete the user
        const deletedUser = await CRUDForm.findByIdAndDelete(id)

        // Respond with success
        return res.status(200).json({
            message: "User deleted successfully.",
            data: deletedUser
        })
    } catch (error) {
        // Handle internal server errors
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}