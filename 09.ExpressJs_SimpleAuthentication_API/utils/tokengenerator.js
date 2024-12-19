const jwt = require("jsonwebtoken")
const secretKey = require("../config/jwt.config")
const generateToken = (user) => {
    return jwt.sign({ user }, secretKey, { expiresIn: '10h' });
}
module.exports=generateToken