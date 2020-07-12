// Registration controller
'use strict';

// Required modules
const db = require("../models");
const fields = [ "comments", "facilityId", "features", "guestId",
    "matNumber", "paymentAmount", "paymentType", "registrationDate",
    "showerTime", "wakeupTime" ];
const Registration = db.Registration;
const BadRequest = require("../errors/bad.request.js");
const NotFound = require("../errors/not.found.js");
const Op = db.Sequelize.Op;

// Public Methods ------------------------------------------------------------

/**
 * <p>Delete the specified Registration.</p>
 *
 * @param id Primary key of the requested Registration
 *
 * @returns {Promise<Registration>} for the Registration that was deleted
 *
 * @throws NotFound if there is no Registration with the specified primary key
 */
exports.delete = async (id) => {
    let result = await Registration.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Registration " + id);
    }
    let num = await Registration.destroy({
        where: { id: id }
    });
    if (num != 1) {
        throw new NotFound("id: Cannot actually delete Registration " + id);
    }
    return result;
};

/**
 * <p>Delete all Registration objects.</p>
 *
 * @returns Number of objects that were deleted
 */
exports.deleteAll = async () => {
    let count = await Registration.destroy({
        truncate: true,
        where: {}
    });
    return count;
}

/**
 * <p>Return all Registration models, with optional match on facilityId
 * and registrationDate, ordered by matNumber</p>
 *
 * @param facilityId Facility id that must match, or null/undefined
 *                   for all facilities
 * @param registrationDate Registration date that must match,
 *                         or null/undefined for all registration dates
 *
 * @returns {Promise<Registration[]>} for the retrieved models
 */
exports.findAll = async (facilityId, registrationDate) => {
    let conditions = {
        order: [
            [ 'facilityId', 'ASC' ],
            [ 'registrationDate', 'ASC' ],
            [ 'matNumber', 'ASC' ]
        ],
        where: { }
    };
    if (facilityId) {
        conditions.where['facilityId'] = facilityId;
    }
    if (registrationDate) {
        conditions.where['registrationDate'] = registrationDate;
    }
    return await Registration.findAll(conditions);
};

/**
 * <p>Return the specified Registration.</p>
 *
 * @param id Primary key of the requested Registration
 *
 * @returns {Promise<Registration>} for the retrieved Registration
 *
 * @throws NotFound if there is no Registration with the specified primary key
 */
exports.findOne = async (id) => {
    let result = await Registration.findByPk(id)
    if (result == null) {
        throw new NotFound("id: Missing Registration " + id);
    } else {
        return result;
    }
};

/**
 * <p>Insert a new Registration.</p>
 *
 * @param data Object containing the data to insert
 *
 * @returns {Promise<Registration>} for the newly created Registration
 *
 * @throws BadRequest if one or more validation constraints are violated
 */
exports.insert = async (data) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        let result = await Registration.create(data, {
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
 * <p>Update an existing Registration.
 *
 * @param id Primary key of the Registration to update
 * @param data Updated field(s) for this Registration
 *
 * @returns {Promise<Registration>} for the updated Registration
 *
 * @throws BadRequest if one or more validation constraints are violated
 * @throws NotFound if there is no Registration with the specified primary key
 */
exports.update = async (id, data) => {
    let count = 0;
    try {
        data.id = id;
        let fieldsPlusId = [...fields];
        fieldsPlusId.push("id");
        count = await Registration.update(data, {
            fields: fieldsPlusId,
            where: {id : id}
        });
        if (count == 0) {
            throw new NotFound("id: Missing Registration " + id);
        }
        return await Registration.findByPk(id);
    } catch (err) {
        if (err instanceof db.Sequelize.ValidationError) {
            throw new BadRequest(err.message);
        } else {
            throw err;
        }
    }
};
