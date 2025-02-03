const express = require("express");
const { AdminAccess, ManagerAccess, UserAccess } = require("../controller/access.controller");
const verifyToken = require("../middleware/auth.middleware");
const authorizedRole = require("../middleware/role.middleware");

const accessroutes = express.Router();

accessroutes.route('/admin').get(verifyToken, authorizedRole("admin"), AdminAccess);
accessroutes.route('/manager').get(verifyToken, authorizedRole("manager", "user"), ManagerAccess);
accessroutes.route('/user').get(verifyToken, authorizedRole("user"), UserAccess);

module.exports = accessroutes;
