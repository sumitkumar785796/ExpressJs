const express = require("express")
const app = express()
const routes = require("./routes/routes.js")
app.use("", routes)
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Express server is running successfully.",
        data: "Success",
    });
});
module.exports = app