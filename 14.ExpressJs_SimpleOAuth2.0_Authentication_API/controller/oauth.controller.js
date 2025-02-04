exports.link = async (req, res) => {
    try {
        res.send('<a href="/auth/google">Login with Google</a>');
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
            success: false
        })
    }
}
// Google Auth Routes
exports.link = async (req, res) => {
    try {
        res.send('<a href="/auth/google">Login with Google</a>');
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
            success: false
        })
    }
}

exports.callback = (req, res) => {
    res.redirect("/profile");
}
// Protected Route
exports.profile = async (req, res) => {
    try {
        if (!req.user) return res.redirect("/");
        res.send(`<h1>Welcome ${req.user.displayName}</h1><img src="${req.user.profileImage}" />`);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
            success: false
        })
    }
}
exports.logout = async (req, res) => {
    try {
        req.logout(() => {
            res.redirect("/");
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message,
            success: false
        })
    }
}
