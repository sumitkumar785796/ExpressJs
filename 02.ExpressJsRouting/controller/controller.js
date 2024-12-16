exports.homePage = async(req,res)=>{
    try {
        return res.status(200).json({
            message:"Home Page",
            data:"success"
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error",
            data:message.error
        })
    }
}
exports.aboutPage = async(req,res)=>{
    try {
        return res.status(200).json({
            message:"About Us Page",
            data:"success"
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error",
            data:message.error
        })
    }
}