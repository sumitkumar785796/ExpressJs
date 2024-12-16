const express = require("express")
const app = express()
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Express server is running successfully.",
        data: "Success",
    });
});
module.exports=app