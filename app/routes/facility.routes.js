// Define routes for the Facility model
module.exports = app => {

    const facilities = require("../controllers/facility.controller.js");
    var router = require("express").Router();

    // DELETE / - Delete all models
    router.delete("/", facilities.deleteAll);

    // GET / - Find all models
    router.get("/", facilities.findAll);

    // POST / - Insert a new model
    router.post("/", facilities.insert);

    // DELETE /:id - Delete model by id
    router.delete("/:id", facilities.delete);

    // GET /:id - Find model by id
    router.get("/:id", facilities.findOne);

    // PUT /:id - Update model by id
    router.put("/:id", facilities.update);

    // Use the defined routes for this model
    app.use("/api/facilities", router);

};
