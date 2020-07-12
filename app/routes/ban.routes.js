// Ban routes
'use strict';

module.exports = app => {

    const db = require("../models");
    const bans = require("../controllers/ban.controller.js");
    var router = require("express").Router();
    const BadRequest = require("../errors/bad.request.js");
    const NotFound = require("../errors/not.found.js");

    // DELETE / - Delete all models
    router.delete("/", async (req, res) => {
        try {
            res.send(await bans.deleteAll());
        } catch (err) {
            console.error("bans.deleteAll error: ", err);
            res.status(500).send(err.message);
        }
    });

    // GET / - Find all models
    router.get("/", async (req, res) => {
        try {
            res.send(await bans.findAll(req.query.guestId));
        } catch (err) {
            console.error("bans.findAll error: ", err);
            res.status(500).send(err.message);
        }
    });

    // POST / - Insert a new model
    router.post("/", async (req, res) => {
        try {
            res.send(await bans.insert(req.body));
        } catch (err) {
            if (err instanceof db.Sequelize.ValidationError) {
                res.status(400).send(err.message);
            } else {
                console.error("bans.insert error ", err);
            }
        }
    });

    // DELETE /:id - Delete model by id
    router.delete("/:id", async (req, res) => {
        try {
            res.send(await bans.delete(req.params.id));
        } catch (err) {
            if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("bans.delete error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // GET /:id - Find model by id
    router.get("/:id", async (req, res) => {
        try {
            res.send(await bans.findOne(req.params.id));
        } catch (err) {
            if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("bans.findOne error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // PUT /:id - Update model by id
    router.put("/:id", async (req, res) => {
        try {
            res.send(await bans.update(req.params.id, req.body));
        } catch (err) {
            if (err instanceof BadRequest) {
                res.status(400).send(err.message);
            } else if (err instanceof NotFound) {
                res.status(404).send(err.message);
            } else {
                console.error("bans.update error: ", err);
                res.status(500).send(err.message);
            }
        }
    });

    // Use the defined routes for this model
    app.use("/api/bans", router);

};
