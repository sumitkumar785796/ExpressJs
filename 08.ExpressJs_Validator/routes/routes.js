const express = require("express")
const routes = express.Router()
const controller = require("../controllers/controller")
routes.route("/").post(controller.AddData).get(controller.ViewData)
routes.route("/:id").put(controller.UpdateData).delete(controller.DeleteData)
module.exports = routes