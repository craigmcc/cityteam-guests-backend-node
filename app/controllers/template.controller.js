// Template controller
'use strict';

// Required modules
const db = require("../models");
const fields = [ "allMats", "facilityId", "handicapMats", "name", "socketMats" ];
const Template = db.Template;
const BadRequest = require("../errors/bad.request.js");
const NotFound = require("../errors/not.found.js");
const Op = db.Sequelize.Op;

// Public Methods ------------------------------------------------------------

/**
 * <p>Delete the specified Template.</p>
 *
 * @param id Primary key of the requested Template
 *
 * @returns {Promise<Template>} for the Template that was deleted
 *
 * @throws NotFound if there is no Template with the specified primary key
 */
exports.delete = async (id) => {
    let result = await Template.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Template " + id);
    }
    let num = await Template.destroy({
        where: { id: id }
    });
    if (num != 1) {
        throw new NotFound("id: Cannot actually delete Template " + id);
    }
    return result;
};

/**
 * <p>Delete all Template objects.</p>
 *
 * @returns Number of objects that were deleted
 */
exports.deleteAll = async () => {
    let count = await Template.destroy({
        truncate: true,
        where: {}
    });
    return count;
}

/**
 * <p>Return all Template models, with optional match on name segment,
 * sorted by name.</p>
 *
 * @param name Name segment that must match, or null/undefined for all models
 *
 * @returns {Promise<Template[]>} for the retrieved models
 */
exports.findAll = async (name) => {
    let conditions = name ? {
        where: {
            name: { [Op.iLike]: `%${name}%` }
        }
    } : { };
    conditions.order = [ ['name', 'ASC'] ];
    return await Template.findAll(conditions);
};

/**
 * <p>Return the specified Template.</p>
 *
 * @param id Primary key of the requested Template
 *
 * @returns {Promise<Template>} for the retrieved Template
 *
 * @throws NotFound if there is no Template with the specified primary key
 */
exports.findOne = async (id) => {
    let result = await Template.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Template " + id);
    } else {
        return result;
    }
};

/**
 * <p>Insert a new Template.</p>
 *
 * @param data Object containing the data to insert
 *
 * @returns {Promise<Template>} for the newly created Template
 *
 * @throws BadRequest if one or more validation constraints are violated
 */
exports.insert = async (data) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let result = await Template.create(data, {
            fields: fields,
            transaction: transaction
        });
        await transaction.commit();
        return result;
    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }
        throw err;
    }
};

/**
 * <p>Update an existing Template.
 *
 * @param id Primary key of the Template to update
 * @param data Updated field(s) for this Template
 *
 * @returns {Promise<Template>} for the updated Template
 *
 * @throws BadRequest if one or more validation constraints are violated
 * @throws NotFound if there is no Template with the specified primary key
 */
exports.update = async (id, data) => {
    let count = 0;
    try {
        data.id = id;
        let fieldsPlusId = [...fields];
        fieldsPlusId.push("id");
        count = await Template.update(data, {
            fields: fieldsPlusId,
            where: {id : id}
        });
        if (count == 0) {
            throw new NotFound("id: Missing Template " + id);
        }
        return await Template.findByPk(id);
    } catch (err) {
        if (err instanceof db.Sequelize.ValidationError) {
            throw new BadRequest(err.message);
        } else {
            throw err;
        }
    }
};
