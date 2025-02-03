const express = require("express");
const { SignUp, SignIn } = require("../controller/auth.controller");
const authroutes = express.Router();
authroutes.route('/signup').post(SignUp);
authroutes.route('/signin').post(SignIn);
module.exports = authroutes
