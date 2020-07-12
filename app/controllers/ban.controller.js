// Ban controller
'use strict';

// Required modules
const db = require("../models");
const fields = [ "banFrom", "banTo", "comments", "guestId", "staff" ];
const Ban = db.Ban;
const BadRequest = require("../errors/bad.request.js");
const NotFound = require("../errors/not.found.js");
const Op = db.Sequelize.Op;

// Public Methods ------------------------------------------------------------

/**
 * <p>Delete the specified Ban.</p>
 *
 * @param id Primary key of the requested Ban
 *
 * @returns {Promise<Ban>} for the Ban that was deleted
 *
 * @throws NotFound if there is no Ban with the specified primary key
 */
exports.delete = async (id) => {
    let result = await Ban.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Ban " + id);
    }
    let num = await Ban.destroy({
        where: { id: id }
    });
    if (num != 1) {
        throw new NotFound("id: Cannot actually delete Ban " + id);
    }
    return result;
};

/**
 * <p>Delete all Ban objects.</p>
 *
 * @returns Number of objects that were deleted
 */
exports.deleteAll = async () => {
    let count = await Ban.destroy({
        truncate: true,
        where: {}
    });
    return count;
}

/**
 * <p>Return all Ban models, with optional match on guestId segment,
 * sorted by banFrom.</p>
 *
 * @param guestId Guest id that must match, or null/undefined for all models
 *
 * @returns {Promise<Ban[]>} for the retrieved models
 */
exports.findAll = async (guestId) => {
    let conditions = guestId ? {
        where: {
            guestId: guestId
        }
    } : { };
    conditions.order = [ ['banFrom', 'ASC'] ];
    return await Ban.findAll(conditions);
};

/**
 * <p>Return the specified Ban.</p>
 *
 * @param id Primary key of the requested Ban
 *
 * @returns {Promise<Ban>} for the retrieved Ban
 *
 * @throws NotFound if there is no Ban with the specified primary key
 */
exports.findOne = async (id) => {
    let result = await Ban.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Ban " + id);
    } else {
        return result;
    }
};

/**
 * <p>Insert a new Ban.</p>
 *
 * @param data Object containing the data to insert
 *
 * @returns {Promise<Ban>} for the newly created Ban
 *
 * @throws BadRequest if one or more validation constraints are violated
 */
exports.insert = async (data) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let result = await Ban.create(data, {
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
 * <p>Update an existing Ban.
 *
 * @param id Primary key of the Ban to update
 * @param data Updated field(s) for this Ban
 *
 * @returns {Promise<Ban>} for the updated Ban
 *
 * @throws BadRequest if one or more validation constraints are violated
 * @throws NotFound if there is no Ban with the specified primary key
 */
exports.update = async (id, data) => {
    let count = 0;
    try {
        data.id = id;
        let fieldsPlusId = [...fields];
        fieldsPlusId.push("id");
        count = await Ban.update(data, {
            fields: fieldsPlusId,
            where: {id : id}
        });
        if (count == 0) {
            throw new NotFound("id: Missing Ban " + id);
        }
        return await Ban.findByPk(id);
    } catch (err) {
        if (err instanceof db.Sequelize.ValidationError) {
            throw new BadRequest(err.message);
        } else {
            throw err;
        }
    }
};
