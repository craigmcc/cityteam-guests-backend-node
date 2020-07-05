'use strict';

// Define routes for the Facility model
module.exports = app => {

    const db = require("../models");
    const facilities = require("../controllers/facility.controller.js");
    var router = require("express").Router();
    const BadRequest = require("../errors/bad.request.js");
    const NotFound = require("../errors/not.found.js");

    // DELETE / - Delete all models
    router.delete("/", async (req, res) => {
        try {
            res.send(await facilities.deleteAll());
        } catch (err) {
            console.error("facilities.deleteAll error: ", err);
            res.status(500).send(err.message);
        }
    });

    // GET / - Find all models
    router.get("/", async (req, res) => {
       try {
           res.send(await facilities.findAll(req.query.name));
       } catch (err) {
           console.error("facilities.findAll error: ", err);
           res.status(500).send(err.message);
       }
    });

    // POST / - Insert a new model
    router.post("/", async (req, res) => {
        try {
            res.send(await facilities.insert(req.body));
        } catch (err) {
            if (err instanceof db.Sequelize.ValidationError) {
                res.status(400).send(err.message);
            } else {
                console.error("facilities.insert error ", err);
            }
        }
    });

    // DELETE /:id - Delete model by id
    router.delete("/:id", async (req, res) => {
        try {
            res.send(await facilities.delete(req.params.id));
        } catch (err) {
            if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("facilities.delete error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // GET /:id - Find model by id
    router.get("/:id", async (req, res) => {
        try {
            res.send(await facilities.findOne(req.params.id));
        } catch (err) {
            if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("facilities.findOne error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // PUT /:id - Update model by id
    router.put("/:id", async (req, res) => {
        try {
            res.send(await facilities.update(req.params.id, req.body));
        } catch (err) {
            if (err instanceof BadRequest) {
                res.status(400).send(err.message);
            } else if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("facilities.update error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // Use the defined routes for this model
    app.use("/api/facilities", router);

};
