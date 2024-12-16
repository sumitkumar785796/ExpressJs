const app = require("./app.js")
const PORT = require("./utils/utils.js")
app.listen(PORT, () => {
    console.log(`Server is now running at http://localhost:${PORT}`)
})