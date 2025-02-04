const app = require("./app");
const { connDB } = require("./config");
const { port } = require("./utils")

// Start Server After Database Connection
const serverStart = async () => {
    try {
        // Ensure that your database connection is successful before starting the server
        await connDB();  // Make sure this function connects to your database

        app.listen(port, () => {
            console.log(`🚀 Server is now started at http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Error while starting the server:", error.message);
    }
};

// Start the server
serverStart();
