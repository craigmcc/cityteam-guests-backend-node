'use strict';

// Required modules
const db = require("../models");
const fields = [ "name", "address1", "address2", "city", "state", "zipCode" ];
const Facility = db.facilities;
const BadRequest = require("../errors/bad.request.js");
const NotFound = require("../errors/not.found.js");
const Op = db.Sequelize.Op;

// Public Methods ------------------------------------------------------------

/**
 * <p>Delete the specified Facility.</p>
 *
 * @param id Primary key of the requested Facility
 *
 * @returns {Promise<Facility>} for the Facility that was deleted
 *
 * @throws NotFound if there is no Facility with the specified primary key
 */
exports.delete = async (id) => {
    let result = await Facility.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Facility " + id);
    }
    let num = await Facility.destroy({
        where: { id: id }
    });
    if (num != 1) {
        throw new NotFound("id: Cannot actually delete Facility " + id);
    }
    return result;
};

/**
 * <p>Delete all Facility objects.</p>
 *
 * @returns Message including number of Facility objects that were deleted
 */
exports.deleteAll = async () => {
    await Facility.destroy({
        truncate: true,
        where: {}
    });
    return "All facilities were deleted successfully";
}

/**
 * <p>Return all Facility models, with optional match on name segment.</p>
 *
 * @param name Name segment that must match, or null/undefined for all models
 *
 * @returns {Promise<Facility[]>} for the retrieved models
 */
exports.findAll = async (name) => {
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    return await Facility.findAll({ where: condition });
};

/**
 * <p>Return the specified Facility.</p>
 *
 * @param id Primary key of the requested Facility
 *
 * @returns {Promise<Facility>} for the retrieved Facility
 *
 * @throws NotFound if there is no Facility with the specified primary key
 */
exports.findOne = async (id) => {
    let result = await Facility.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Facility ", id);
    } else {
        return result;
    }
};

/**
 * <p>Insert a new Facility.</p>
 *
 * @param data Object containing the data to insert
 *
 * @returns {Promise<Facility>} for the newly created Facility
 *
 * @throws BadRequest if one or more validation constraints are violated
 */
exports.insert = async (data) => {
    try {
        return await Facility.create(data, {
            fields: fields
        });
    } catch (err) {
        throw err;
    }
};

/**
 * <p>Update an existing Facility.
 *
 * @param id Primary key of the Facility to update
 * @param data Updated field(s) for this Facility
 *
 * @returns {Promise<Facility>}
 *
 * @throws BadRequest if one or more validation constraints are violated
 * @throws NotFound if there is no Facility with the specified primary key
 */
exports.update = async (id, data) => {
    let count = 0;
    try {
        data.id = id;
        let fieldsPlusId = [...fields];
        fieldsPlusId.push("id");
        count = await Facility.update(data, {
            fields: fieldsPlusId,
            where: {id : id}
        });
        if (count == 0) {
            throw new NotFound("id: Missing Facility " + id);
        }
        return await Facility.findByPk(id);
    } catch (err) {
        if (err instanceof db.Sequelize.ValidationError) {
            throw new BadRequest(err.message);
        } else {
            throw err;
        }
    }
};
