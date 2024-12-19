const jwt = require("jsonwebtoken")
const secretKey = require("../config/jwt.config")

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"] || req.cookies.token

    if (!token) {
        return res.status(403).json({
            message: "A token is required for authentication..."
        })
    }

    try {
        let tokenBearer

        if (req.headers["authorization"]) {
            const bearer = token.split(' ')
            tokenBearer = bearer[1]
        } else {
            tokenBearer = token
        }
        const decodedData = jwt.verify(tokenBearer, secretKey)
        req.user = decodedData
    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token..."
        })
    }

    return next()
}

module.exports = verifyToken
