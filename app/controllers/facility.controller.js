// Required modules
const db = require("../models");
const Facility = db.facilities;
const Op = db.Sequelize.Op;

// Public Methods ------------------------------------------------------------

// Delete a single model by id
exports.delete = (req, res) => {

    const id = req.params.id;

    Facility.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "Successful delete"
                });
            } else {
                res.status(404).send({
                    message: "id: No such facility with id " + id
                });
            }
        })
        .catch(err => {
            console.log("Facility.delete() error: " + JSON.stringify(err));
            res.status(500).send({
                message: err.message || "Error deleting facility"
            });
        });

};

// Delete all models from the database TODO - do not expose in production!
exports.deleteAll = (req, res) => {

    Facility.destroy({
        truncate: false,
        where: {}
    })
        .then(num => {
            res.status(200).send({
                message: `${num} facilities were deleted successfully`
            });
        })
        .catch(err => {
            console.log("Facility.deleteAll() error: " + JSON.stringify(err));
            res.status(500).send({
                message: err.message || "Error deleting all facilities"
            });
        });

};

// Find all models, with optional match on title
exports.findAll = (req, res) => {

    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Facility.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log("Facility.findAll() error: " + JSON.stringify(err));
            res.status(500).send({
                message: err.message || "Error retrieving facilities"
            });
        });

};

// Find a single model by id
exports.findOne = (req, res) => {

    const id = req.params.id;

    Facility.findByPk(id)
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    message: "id: No such facility with id " + id
                });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            console.log("Facility.findOne() error: " + JSON.stringify(err));
            res.status(500).send({
                message: err.message || "Error finding one facility"
            });
        });

};

// Insert a new model (was create())
exports.insert = (req, res) => {

    // Validate the request
    // TODO - extract into common method
    // TODO - uniqueness check
    if (!req.body.name) {
        res.status(400).send({
            message: "name:  Required and cannot be empty"
        });
        return;
    }

    // Save the new model in the database and return it
    const facility = populate(req);
    Facility.create(facility)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            console.log("Facility.insert() error: " + JSON.stringify(err));
            res.status(500).send({
                message: err.message || "Error creating the facility"
            });
        });
};

// Update an existing model
exports.update = (req, res) => {

    // Validate the request
    // TODO - extract into common method
    // TODO - uniqueness check (ok to update existing one)
    if (!req.body.name) {
        res.status(400).send({
            message: "name:  Required and cannot be empty"
        });
        return;
    }

    // Update the existing model in the database

    const id = req.params.id;

    Facility.update(populate(req), {
        where: {id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Successful update"
                });
            } else {
                res.status(404).send({
                    message: "id: Missing facility " + id
                });
            }
        })
        .catch(err => {
            console.log("Facility.update() error: " + JSON.stringify(err));
            res.status(500).send({
                message: err.message || "Error updating the facility"
            });
        });

};

// Support Methods -----------------------------------------------------------

function populate(req) {
    const facility = {
        name : req.body.name,
        address1 : req.body.address1,
        address2 : req.body.address2,
        city : req.body.city,
        state : req.body.state,
        zipCode : req.body.zipCode
    }
    return facility;
}
