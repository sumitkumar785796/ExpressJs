const express = require("express");
const session = require("express-session");
const app = express();
const passport = require("./config/passport");
const oauth = require("./routes/oauth.routes");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Management
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());
//oauth routes
app.use("/",oauth)

module.exports = app
