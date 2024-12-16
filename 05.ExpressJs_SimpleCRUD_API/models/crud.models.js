const mongoose = require('mongoose')

// Define the schema
const CRUDSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim: true, // Removes leading/trailing spaces
    },
    lname: {
        type: String,
        trim: true, // Removes leading/trailing spaces
    },
    email: {
        type: String,
        required: [true, "Email is required"], // Required field with custom error message
        unique: true, // Ensures email uniqueness
        trim: true, // Removes leading/trailing spaces
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address",
        ], // Regex for email validation
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
})

// Define the model
const CRUDForm = mongoose.model('CRUDForm', CRUDSchema)

module.exports = CRUDForm
