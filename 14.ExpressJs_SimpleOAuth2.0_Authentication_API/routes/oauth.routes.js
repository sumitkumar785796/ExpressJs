const express = require("express")
const { link, callback, profile, logout } = require("../controller/oauth.controller")
const passport = require("passport")
const oauth = express.Router()
oauth.route('/').get(link)
oauth.route('/auth/google').get(passport.authenticate("google", { scope: ["profile", "email"] }))
oauth.route('/auth/google/callback').get(passport.authenticate("google", { failureRedirect: "/" }), callback)
oauth.route('/profile').get(profile)
oauth.route('/logout').get(logout)
module.exports = oauth