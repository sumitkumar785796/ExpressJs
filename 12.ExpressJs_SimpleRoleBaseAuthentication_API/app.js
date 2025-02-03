const express = require("express")
const authroutes = require("./routes/auth.routes")
const accessroutes = require("./routes/access.routes")
const app = express()
//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//auth routes
app.use('/api/auth',authroutes)
app.use('/api/access',accessroutes)
app.get('/',(req,res)=>{
    res.json({
        message:"Server is now started..."
    })
})
module.exports=app