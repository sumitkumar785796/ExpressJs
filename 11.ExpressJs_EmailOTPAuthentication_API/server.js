const app = require("./app")
const { connDB } = require("./config/conn")
const { PORT } = require("./utils/utils")
connDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server is running at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error.message)
        process.exit(1)
    })
