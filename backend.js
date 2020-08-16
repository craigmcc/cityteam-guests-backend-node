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

/*
// Configure openapi support (npm install @wesleytodd/openapi)
const openapi = require('@wesleytodd/openapi')
const oapi = openapi({
      openapi: '3.0.0',
    info: {
          title: 'CityTeam Guests Application Backend',
        version: '1.0.0'
    }
})
app.use(oapi)
app.use('/openapi-ui', oapi.redoc)
//app.use('/openapi-ui', oapi.swaggerui)
*/

// Configure database and models
const db = require("./app/models");
db.sequelize.sync();
// // drop the tables if they already exist
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// Simple route for "Hello, World" message
app.get("/", (req, res) => {

    /*
    app.get("/", oapi.path({
        description: 'Hello, World! message',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    }), (req, res) => {
    */

    res.json({ message: "Welcome to CityTeam Guests - Backend Application." });

});

// Define routes for each model
require("./app/routes/ban.routes")(app);
require("./app/routes/facility.routes")(app);
require("./app/routes/guest.routes")(app);
require("./app/routes/registration.routes")(app);
require("./app/routes/template.routes")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
