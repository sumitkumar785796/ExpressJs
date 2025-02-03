const mongoose = require("mongoose")
const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["admin","manager","user"],
        default:"user",
    },
    status:{
        type:String,
        enum:["Active","De-Active"],
        default:"De-Active"
    }
},{timestamps:true})
const authModel=mongoose.model("authrole",authSchema)
module.exports=authModel