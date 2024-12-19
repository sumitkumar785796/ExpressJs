const express = require("express")
const authroutes = require("./routes/auth.routes")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('',authroutes)
app.all("*",(req,res)=>{
    res.status(200).json({
        message:"page is not found...",
        data:"Success"
    })
})
module.exports = app