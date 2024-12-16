const {homePage,aboutPage} = require("../controller/controller.js")
const express = require("express")
const routes = express.Router()
routes.get("/home",homePage)
routes.get("/about",aboutPage)
module.exports=routes