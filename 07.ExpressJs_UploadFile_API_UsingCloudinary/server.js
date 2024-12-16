const app = require("./app.js")
const { connDB } = require("./config/conn.js")
const { PORT } = require("./utils/utils.js");

// Connect to the database
connDB()
    .then(() => {
        // Start the server if the database connection is successful
        app.listen(PORT, () => {
            console.log(`Server is now running at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        // Log and handle any database connection errors
        console.error("Database connection failed:", error.message)
        process.exit(1) // Exit process with failure
    });
