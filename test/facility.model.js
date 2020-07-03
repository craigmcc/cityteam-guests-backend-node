// Tests for facility.model.js

const chai = require('chai');
const expect = chai.expect;

const db = require("./index.js");
const Facility = require("../app/models/facility.model.js")(db.sequelize);
const SequelizeValidationError = db.Sequelize.SequelizeValidationError;

const dataset = {
    facility1full: {
        name: 'First Facility',
        address1: 'First Address 1',
        address2: 'First Address 2',
        city: 'First City',
        state: 'OR',
        zipCode: '99999'
    },
    facility1noName: {
        address1: 'First Address 1',
        address2: 'First Address 2',
        city: 'First City',
        state: 'OR',
        zipCode: '99999'
    },
    facility2full: {
        name: 'Second Facility',
        address1: 'Second Address 1',
        address2: 'Second Address 2',
        city: 'Second City',
        state: 'WA',
        zipCode: '88888'
    },
    facility3full: {
        name: 'Third Facility',
        address1: 'Third Address 1',
        address2: 'Third Address 2',
        city: 'Third City',
        state: 'CA',
        zipCode: '77777'
    }
};

describe('Facility Model Tests', function() {

    // Testing Hooks ---------------------------------------------------------

    before("#init", async () => {
//        console.log("#init running");
        await Facility.sync({
            force: true
        });
    });

    beforeEach("#erase", async () => {
//        console.log("#erase running");
        await Facility.destroy({
            cascade: true,
            truncate: true
        });
    });

    // Testing Methods -------------------------------------------------------

    describe("#bulkCreate()", () => {

        context("with duplicate name", () => {

            it("should cause validation error", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility1full
                ];
                try {
                    await Facility.bulkCreate(data, {
                        validate: true
                    });
                    expect(1).equal.to("bulkCreate should have failed", 0);
                } catch (err) {
                    expect(err.message).includes("Validation error");
                }

            });

        });

        context("with empty name", () => {

            it("should cause validation error", async () => {

                let data = [
                    dataset.facility1noName,
                    dataset.facility1full
                ];
                try {
                    await Facility.bulkCreate(data, {
                        validate: true
                    });
                    expect(1).equal.to("bulkCreate should have failed", 0);
                } catch (err) {
                    expect(err.errors[0].message).includes("facility.name cannot be null");
                }

            });

        });

        context("with full arguments", () => {

            it("should add three objects and return ids", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                expect(results).to.not.be.null;
                expect(results).to.be.an("array");
                expect(results).to.have.length(3);
                results.forEach(result => {
                    expect(result.id).to.not.be.null;
                });

            });

            it("should do nothing if transaction rolled back", async() => {

                let count = await Facility.count({});
                expect(count).to.equal(0);

                let transaction = await db.sequelize.transaction();

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    transaction: transaction,
                    validate: true
                });

                await transaction.rollback();

                count = await Facility.count({});
                expect(count).to.equal(0);

            });

            it("should show up if transaction committed", async() => {

                let count = await Facility.count({});
                expect(count).to.equal(0);

                let transaction = await db.sequelize.transaction();

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    transaction: transaction,
                    validate: true
                });

                await transaction.commit();

                count = await Facility.count({});
                expect(count).to.equal(3);

            });

        });

    });

    describe("#create()", () => {

        context("with duplicate name", () => {

            it("should cause validation error", async () => {
                let data1a = await Facility.create(dataset.facility1full);
                try {
                    let data1b = await Facility.create(dataset.facility1full);
                } catch (err) {
                    expect(err.message).includes("facility.name '" +
                        data1a.name + "' is already in use");
                }
            });

        });

        context("with empty name", () => {

            it("should cause validation error", async () => {
                try {
                    let result = await Facility.create(dataset.facility1noName);
                } catch (err) {
                    expect(err.message).includes("facility.name cannot be null");
                }
            });

        });

        context("with field restrictions", () => {

            it("should insert only unrestricted fields", async () => {
               let inserted = await (Facility.create(dataset.facility1full, {
                   fields: ["name", "city", "state"]
               }));
               let result = await Facility.findByPk(inserted.id);
               expect(result).to.not.be.null;
               expect(result.id).to.not.be.null;
               expect(result.name).to.equal(dataset.facility1full.name);
               expect(result.address1).to.be.null;
               expect(result.address2).to.be.null;
               expect(result.city).to.equal(dataset.facility1full.city);
               expect(result.state).to.equal(dataset.facility1full.state);
               expect(result.zipCode).to.be.null;
               expect(result.createdAt).to.not.be.null;
               expect(result.updatedAt).to.not.be.null;
            });

        });

        context("with full arguments", () => {

            it("should add one full object", async () => {

                let data1 = await Facility.create(dataset.facility1full);
                let result1 = await Facility.findByPk(data1.id);
                expect(result1).to.not.be.null;

                let count = await Facility.count({});
                expect(count).to.equal(1);

            });

            it("should add two full objects", async () => {

                let data1 = await Facility.create(dataset.facility1full);
                let result1 = await Facility.findByPk(data1.id);
                expect(result1).to.not.be.null;

                let data2 = await Facility.create(dataset.facility2full);
                let result2 = await Facility.findByPk(data2.id);
                expect(result2).to.not.be.null;

                let count = await Facility.count({});
                expect(count).to.equal(2);

            });

            it("should add three full objects", async () => {

                let data1 = await Facility.create(dataset.facility1full);
                let result1 = await Facility.findByPk(data1.id);
                expect(result1).to.not.be.null;

                let data2 = await Facility.create(dataset.facility2full);
                let result2 = await Facility.findByPk(data2.id);
                expect(result2).to.not.be.null;

                let data3 = await Facility.create(dataset.facility3full);
                let result3 = await Facility.findByPk(data3.id);
                expect(result3).to.not.be.null;

                let count = await Facility.count({});
                expect(count).to.equal(3);

            });

            it("should disappear if transaction rolled back", async() => {

                let count = await Facility.count({});
                expect(count).to.equal(0);

                let transaction = await db.sequelize.transaction();

                let result = await Facility.create(dataset.facility1full, {
                    transaction: transaction
                });

                await transaction.rollback();

                count = await Facility.count({});
                expect(count).to.equal(0);

            });

            it("should show up if transaction committed", async() => {

                let count = await Facility.count({});
                expect(count).to.equal(0);

                let transaction = await db.sequelize.transaction();

                let result = await Facility.create(dataset.facility1full, {
                    transaction: transaction
                });

                await transaction.commit();

                count = await Facility.count({});
                expect(count).to.equal(1);


            });


        });

    });

    describe("#describe()", function () {

        context("with no arguments", () => {

            it("should return description from database", () => {
                Facility.describe()
                    .then(describe => {
//                        console.log("Returned hash: ", JSON.stringify(describe));
                        validateField(describe, 'id', 'INTEGER', true, false);
                        validateField(describe, 'name', 'VARCHAR(255)', false, true);
                        validateField(describe, 'address1', 'VARCHAR(255)', true, false);
                        validateField(describe, 'address2', 'VARCHAR(255)', true, false);
                        validateField(describe, 'city', 'VARCHAR(255)', true, false);
                        validateField(describe, 'state', 'VARCHAR(2)', true, false);
                        validateField(describe, 'createdAt', 'DATETIME', false, false);
                        validateField(describe, 'updatedAt', 'DATETIME', false, false);
                    })
                    .catch(err => {
                        throw err;
                    });
            });

        });

    });

    describe("#destroy()", () => {

        context("all objects", () => {

            it("should destroy all objects", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count = await Facility.count({});
                expect(count).to.equal(3);

                count = await Facility.destroy({
                    truncate: true,
                    where: {}
                });
                expect(count).to.equal(3);

                count = await Facility.count({});
                expect(count).to.equal(0);

            });

            it("should destroy all objects if transaction committed", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                let transaction = await db.sequelize.transaction();

                let count2 = await Facility.destroy({
                    transaction: transaction,
                    truncate: true,
                    where: {  }
                });
                expect(count2).to.equal(3);

                await transaction.commit();

                let count3 = await Facility.count({});
                expect(count3).to.equal(0);

            });

            it("should destroy zero objects if transaction rolled back", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                let transaction = await db.sequelize.transaction();

                let count2 = await Facility.destroy({
                    transaction: transaction,
                    truncate: true,
                    where: {  }
                });
                expect(count2).to.equal(3);

                await transaction.rollback();

                let count3 = await Facility.count({});
                expect(count3).to.equal(3);

            });


        });

        context("one object", () => {

            it("should destroy one object", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                let count2 = await Facility.destroy({
                    where: { id : results[1].id }
                });
                expect(count2).to.equal(1);

                let count3 = await Facility.count({});
                expect(count3).to.equal(2);

            });

            it("should destroy one object if transaction committed", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                let transaction = await db.sequelize.transaction();

                let count2 = await Facility.destroy({
                    transaction: transaction,
                    where: { id : results[1].id }
                });
                expect(count2).to.equal(1);

                await transaction.commit();

                let count3 = await Facility.count({});
                expect(count3).to.equal(2);

            });

            it("should destroy zero objects if transaction rolled back", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                let transaction = await db.sequelize.transaction();

                let count2 = await Facility.destroy({
                    transaction: transaction,
                    where: { id : results[1].id }
                });
                expect(count2).to.equal(1);

                await transaction.rollback();

                let count3 = await Facility.count({});
                expect(count3).to.equal(3);

            })

            it("should do nothing on invalid id", async () => {

                let count = await Facility.destroy({
                    where: { id: 9999 }
                });
                expect(count).to.equal(0);

            })

        });

    });

    describe("#find()", () => {

        context("all objects", () => {

            it("should find all objects", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                results = await Facility.findAll({});
                expect(results.length).to.equal(3);

            });

        });

        context("one object", () => {

            it("should find one object by valid id", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                results = await Facility.findByPk(results[2].id);
                expect(results).is.not.null;

            });

            it("should find zero objects by invalid id", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                let results = await Facility.bulkCreate(data, {
                    validate: true
                });

                let count1 = await Facility.count({});
                expect(count1).to.equal(3);

                results = await Facility.findByPk(9999);
                expect(results).is.null;

            });

        });

    });

    describe("#update()", () => {

        context("one object", () => {

            it("should fail trying to change name to one already in use", async () => {

                let result1 = await Facility.create(dataset.facility1full);
                let result2 = await Facility.create(dataset.facility2full);

                let data = {
                    ...dataset.facility2full
                };
                data.id = result2.id;
                data.name = dataset.facility1full.name;
                try {
                    let result2a = await Facility.update(dataset.facility1full, {
                        where: {id: result2.id}
                    });
                } catch (err) {
                    expect(err.message).includes("facility.name '" +
                        dataset.facility1full.name + "' is already in use");
                }

            });

            it("should fail trying to violate validation rules", async () => {

                let result = await Facility.create(dataset.facility1full);
                let data = {
                    ...dataset.facility1full
                };
                data.id = result.id;
                data.name = null;
                try {
                    await Facility.update(data, {
                        where: {id: result.id}
                    });
                } catch (err) {
                    expect(err.message).includes("facility.name cannot be null");
                }

            });

            it("should update one full object", async () => {

                let data = await Facility.create(dataset.facility1full);
                let id = data.id;
                let result = await Facility.findByPk(id);
                expect(result).to.not.be.null;

                let count = await Facility.count({});
                expect(count).to.equal(1);

                data = {
                    ...dataset.facility1full
                };
                data.id = id; // IRL: Override whatever the client set to avoid spoofing
                data.address1 = data.address1 + " Updated";
                count = await Facility.update(data, {
                    where: {id: id}
                });
                expect(count[0]).to.equal(1);

                result = await Facility.findByPk(id);
                expect(result).to.not.be.null;
                expect(result.address1).to.equal(dataset.facility1full.address1 + " Updated");

            });

        });

        context("with field restrictions", async () => {

            it("should update only unrestricted fields", async () => {

                let data = await Facility.create(dataset.facility1full);
                let id = data.id;
                let result = await Facility.findByPk(id);
                expect(result).to.not.be.null;

                let count = await Facility.count({});
                expect(count).to.equal(1);

                data = {
                    ...dataset.facility1full
                };
                data.id = id; // IRL: Override whatever the client set to avoid spoofing
                data.address1 = data.address1 + " Updated";
                data.address2 = data.address2 + " Updated";
                count = await Facility.update(data, {
                    fields: [ "address1" ],
                    where: {id: id}
                });
                expect(count[0]).to.equal(1);

                result = await Facility.findByPk(id);
                expect(result).to.not.be.null;
                expect(result.address1).to.equal(dataset.facility1full.address1 + " Updated");
                expect(result.address2).to.equal(dataset.facility1full.address2);

            });

        });

    });

});



// Support Methods -----------------------------------------------------------

/**
 * <p>Create and return a new row, waiting for the asynchronous operation
 * to complete.</p>
 *
 * @param data Object containing input fields
 *
 * @return Inserted model
 */
async function create(data) {
    result = await Facility.create(data);
    return result;
}

/**
 * <p>Populate a model object from the specified object</p>
 *
 * @param data Object from which to acquire data
 *
 * @return Model object populated from the specified data
 */
function populate(data) {
    const model = Facility.build({
        name: data.name,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode
    });
    return model;
}

/**
 * <p>Validate the descriptive information about the specified field against
 * the specified parameters.</p>
 *
 * @param describe Return value from describe() operation
 * @param name Name of the field to validate
 * @param type Expected value for "type" property
 * @param allowNull Expected value for "allowNull" property (optional)
 * @param unique Expected value for "unique" property (optional)
 */
function validateField(describe, name, type, allowNull, unique) {
    var field = describe[name];
    expect(field).to.not.be.null;
    expect(field.type).to.be.a('string');
    expect(field.type).to.equal(type);
    if (allowNull !== null) {
        expect(field.allowNull).to.be.a('boolean');
        expect(field.allowNull).to.equal(allowNull);
    }
    if (unique !== null) {
        expect(field.unique).to.be.a('boolean');
        expect(field.unique).to.equal(unique);
    }
}
