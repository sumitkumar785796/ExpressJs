const app = require("./app.js")
const PORT = require('./utils/utils.js')
app.listen(PORT,()=>{
    console.log(`server is now started at http://localhost:${PORT}`)
})