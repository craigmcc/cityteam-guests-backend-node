// Required modules
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

// Configuration parameters
var corsOptions = {
    origin: "http://localhost:8081"
};

// Configure application
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure database and models
const db = require("./app/models");
db.sequelize.sync();
// // drop the tables if they already exist
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// Simple route for "Hello, World" message
app.get("/", (req, res) => {
    res.json({ message: "Welcome to CityTeam Guests - Backend Application." });
});

// Define routes for each model
require("./app/routes/facility.routes")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
