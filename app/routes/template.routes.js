// Template routes
'use strict';

module.exports = app => {

    const db = require("../models");
    const templates = require("../controllers/template.controller.js");
    var router = require("express").Router();
    const BadRequest = require("../errors/bad.request.js");
    const NotFound = require("../errors/not.found.js");

    // DELETE / - Delete all models
    router.delete("/", async (req, res) => {
        try {
            res.send(await templates.deleteAll());
        } catch (err) {
            console.error("templates.deleteAll error: ", err);
            res.status(500).send(err.message);
        }
    });

    // GET / - Find all models
    router.get("/", async (req, res) => {
        try {
            res.send(await templates.findAll(req.query.name));
        } catch (err) {
            console.error("templates.findAll error: ", err);
            res.status(500).send(err.message);
        }
    });

    // POST / - Insert a new model
    router.post("/", async (req, res) => {
        try {
            res.send(await templates.insert(req.body));
        } catch (err) {
            if (err instanceof db.Sequelize.ValidationError) {
                res.status(400).send(err.message);
            } else {
                console.error("templates.insert error ", err);
            }
        }
    });

    // DELETE /:id - Delete model by id
    router.delete("/:id", async (req, res) => {
        try {
            res.send(await templates.delete(req.params.id));
        } catch (err) {
            if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("templates.delete error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // GET /:id - Find model by id
    router.get("/:id", async (req, res) => {
        try {
            res.send(await templates.findOne(req.params.id));
        } catch (err) {
            if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("templates.findOne error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // PUT /:id - Update model by id
    router.put("/:id", async (req, res) => {
        try {
            res.send(await templates.update(req.params.id, req.body));
        } catch (err) {
            if (err instanceof BadRequest) {
                res.status(400).send(err.message);
            } else if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("templates.update error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // Use the defined routes for this model
    app.use("/api/templates", router);

};
