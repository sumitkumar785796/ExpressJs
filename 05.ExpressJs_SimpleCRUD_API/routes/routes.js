const express = require("express")
const { creates, read, Update, Delete } = require("../controllers/crud.controllers.js")

const routes = express.Router()

// Routes for general operations
routes.route("/")
    .post(creates) // Create a new user
    .get(read)   // Get all users

// Routes for specific user operations
routes.route("/user/:id")
    .put(Update)   // Update a user by ID
    .delete(Delete) // Delete a user by ID

module.exports = routes
