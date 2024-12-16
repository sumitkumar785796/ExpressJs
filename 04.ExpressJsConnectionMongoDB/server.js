const app = require("./app.js")
const { connDB } = require("./config/conn.js")
const { PORT } = require("./utils/utils.js")
connDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is now running at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })