const app = require("./app")
const { connDB } = require("./config")
const { port } = require("./utils")
const serverStart = async () => {
    try {
        await connDB();

        app.listen(port, () => {
            console.log(`🚀Server is now started http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Something error...",error.message)
    }
}
serverStart()