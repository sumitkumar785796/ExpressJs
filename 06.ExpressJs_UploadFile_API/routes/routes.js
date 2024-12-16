const express = require("express")
const { FileUpload, FileView, FileUpdate, FileDelete } = require("../controllers/uploadFile.controllers.js")

const routes = express.Router()

// Routes for general operations
routes.route("/")
    .post(FileUpload) // Create a new user
    .get(FileView)   // Get all users

// Routes for specific user operations
routes.route("/user/:id")
    .put(FileUpdate)   // Update a user by ID
    .delete(FileDelete) // Delete a user by ID

module.exports = routes
