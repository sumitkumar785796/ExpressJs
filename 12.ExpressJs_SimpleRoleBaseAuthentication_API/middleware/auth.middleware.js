const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../utils/token");

const verifyToken = async (req, res, next) => {
    try {
        // Extract token from Authorization header or cookies
        let token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
        
        // If no token is provided, return error
        if (!token) {
            return res.status(403).json({
                message: "Token is required for authentication.",
                success: false
            });
        }

        // Verify token
        const decodedData = jwt.verify(token, jwtSecretKey);
        req.user = decodedData;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token.",
            data: error.message,
            success: false
        });
    }
};

module.exports = verifyToken;
