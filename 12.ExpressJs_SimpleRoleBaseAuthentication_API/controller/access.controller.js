exports.AdminAccess = async (req, res) => {
    try {
        const access = req.user.user;
        return res.status(200).json({
            message: `Admin is access`,
            data: access,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error...",
            data: error.message,
            success: false
        })
    }
}
exports.ManagerAccess = async (req, res) => {
    try {
        const access = req.user.user;
        return res.status(200).json({
            message: `Manager is access`,
            data: access,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error...",
            data: error.message,
            success: false
        })
    }
}
exports.UserAccess = async (req, res) => {
    try {
        const access = req.user.user;
        return res.status(200).json({
            message: `User is access`,
            data: access,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error...",
            data: error.message,
            success: false
        })
    }
}