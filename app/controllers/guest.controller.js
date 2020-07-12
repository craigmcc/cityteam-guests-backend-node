// Guest controller
'use strict';

// Required modules
const db = require("../models");
const fields = [ "comments", "facilityId", "firstName", "lastName" ];
const Guest = db.Guest;
const BadRequest = require("../errors/bad.request.js");
const NotFound = require("../errors/not.found.js");
const Op = db.Sequelize.Op;

// Public Methods ------------------------------------------------------------

/**
 * <p>Delete the specified Guest.</p>
 *
 * @param id Primary key of the requested Guest
 *
 * @returns {Promise<Guest>} for the Guest that was deleted
 *
 * @throws NotFound if there is no Guest with the specified primary key
 */
exports.delete = async (id) => {
    let result = await Guest.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Guest " + id);
    }
    let num = await Guest.destroy({
        where: { id: id }
    });
    if (num != 1) {
        throw new NotFound("id: Cannot actually delete Guest " + id);
    }
    return result;
};

/**
 * <p>Delete all Guest objects.</p>
 *
 * @returns Number of objects that were deleted
 */
exports.deleteAll = async () => {
    let count = await Guest.destroy({
        truncate: true,
        where: {}
    });
    return count;
}

/**
 * <p>Return all Guest models, with optional match on firstName
 * or lastName segment, sorted by firstName and lastName.</p>
 *
 * @param name Name segment that must match, or null/undefined for all models
 *
 * @returns {Promise<Guest[]>} for the retrieved models
 */
exports.findAll = async (name) => {
    let conditions = name ? {
        where: {
            [Op.or]: {
                firstName: {[Op.iLike]: `%${name}%`},
                lastName: {[Op.iLike]: `%${name}%`}
            }
        }
    } : { };
    conditions.order = [
        ['firstName', 'ASC'],
        ['lastName', 'ASC']
    ];
    return await Guest.findAll(conditions);
};

/**
 * <p>Return the specified Guest.</p>
 *
 * @param id Primary key of the requested Guest
 *
 * @returns {Promise<Guest>} for the retrieved Guest
 *
 * @throws NotFound if there is no Guest with the specified primary key
 */
exports.findOne = async (id) => {
    let result = await Guest.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Guest " + id);
    } else {
        return result;
    }
};

/**
 * <p>Insert a new Guest.</p>
 *
 * @param data Object containing the data to insert
 *
 * @returns {Promise<Guest>} for the newly created Guest
 *
 * @throws BadRequest if one or more validation constraints are violated
 */
exports.insert = async (data) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let result = await Guest.create(data, {
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
 * <p>Update an existing Guest.
 *
 * @param id Primary key of the Guest to update
 * @param data Updated field(s) for this Guest
 *
 * @returns {Promise<Guest>} for the updated Guest
 *
 * @throws BadRequest if one or more validation constraints are violated
 * @throws NotFound if there is no Guest with the specified primary key
 */
exports.update = async (id, data) => {
    let count = 0;
    try {
        data.id = id;
        let fieldsPlusId = [...fields];
        fieldsPlusId.push("id");
        count = await Guest.update(data, {
            fields: fieldsPlusId,
            where: {id : id}
        });
        if (count == 0) {
            throw new NotFound("id: Missing Guest " + id);
        }
        return await Guest.findByPk(id);
    } catch (err) {
        if (err instanceof db.Sequelize.ValidationError) {
            throw new BadRequest(err.message);
        } else {
            throw err;
        }
    }
};
