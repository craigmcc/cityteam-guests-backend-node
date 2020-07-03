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
                    message: "Facility: Successful delete"
                });
            } else {
                res.status(404).send({
                    message: "id: No such facility with id " + id
                });
            }
        })
        .catch(err => {
            console.error("Facility.delete() error: ", err);
            res.status(500).send({
                message: err.message || "Error deleting facility"
            });
        });

};

// Delete all models from the database TODO - do not expose in production!
exports.deleteAll = (req, res) => {

    Facility.destroy({
        truncate: true,
        where: {}
    })
        .then(num => {
            res.status(200).send({
                message: `Facility: ${num} facilities were deleted successfully`
            });
        })
        .catch(err => {
            console.error("Facility.deleteAll() error: ", err);
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
            console.error("Facility.findAll() error: ", err);
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
            console.error("Facility.findOne() error: ", err);
            res.status(500).send({
                message: err.message || "Error finding one facility"
            });
        });

};

// Insert a new model (was create())
exports.insert = (req, res) => {

    const inserting = populate(req);
    inserting.id = null;
    console.log("inserting is " + JSON.stringify(inserting));

    Facility.create(inserting, {
        // Add "id" for the update version
        "fields": ["name", "address1", "address2", "city", "state", "zipCode"]
    })
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            if (err instanceof db.Sequelize.ValidationError) {
                res.status(400).send(err.errors);
            } else {
                console.error("Facility.insert() error: ", err);
                res.status(500).send({
                    message: err.message || "Error creating the facility"
                });
            }
        });

};

// Update an existing model
exports.update = (req, res) => {

    const updating = populate(req);
    updating.id = req.params.id;
    console.log("updating is " + JSON.stringify(updating));

    Facility.update(updating, {
        returning: true,
        where: {id: req.params.id }
    })
/*
        .then(num => {
            if (num == 1) {
                Facility.findByPk(req.params.id)
                    .then(data => {
                        if (data === null) {
                            res.status(404).send({
                                message: "id: Missing facility (after update) " + req.params.id
                            });
                        } else {
                            res.send(data);
                        }
                    });
            } else {
                res.status(404).send({
                    message: "id: Missing facility " + id
                });
            }
        })
*/
        .then(([num, updated]) => {
            console.log("num is " + num);
            console.log("updated is " + JSON.stringify(updated));
            if (num == 1) {
                res.send(updated[0]);
            } else {
                res.status(404).send({
                    message: "Missing facility " + req.params.id
                });
            }
        })
        .catch(err => {
            if (err instanceof db.Sequelize.ValidationError) {
                res.status(400).send(err.errors);
            } else {
                console.error("Facility.update() error: ", err);
                res.status(500).send({
                    message: err.message || "Error updating the facility"
                });
            }
        });

};

// Support Methods -----------------------------------------------------------

/**
 * <p>Populate and return a Facility object from the contents of the
 * specified request body, including only client-modifiable fields.</p>
 *
 * @param req Request being processed
 *
 * @returns Facility object with relevant fields from the request body
 */
function populate(req) {

    const facility = Facility.build({
        name : req.body.name,
        address1 : req.body.address1,
        address2 : req.body.address2,
        city : req.body.city,
        state : req.body.state,
        zipCode : req.body.zipCode
    });
    return facility;

}
