// Tests for Template controller
'use strict';

// Required modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../../app/models");
const Facility = db.Facility;
const Template = db.Template;

const controller = require("../../app/controllers/template.controller");

// Test data
const dataset = {

    // Must store results of newly create Facility objects to pick up PK
    facility1full: {
        name: 'First Facility',
        address1: 'First Address 1 Model',
        address2: 'First Address 2',
        city: 'First City',
        state: 'OR',
        zipCode: '99999'
    },
    facility2full: {
        name: 'Second Facility',
        address1: 'Second Address 1 Model',
        address2: 'Second Address 2',
        city: 'Second City',
        state: 'OR',
        zipCode: '99999'
    },

    // Fill in facilityId after Facility is created
    template1Full: {
        allMats: "1-24",
        facilityId: 0,
        handicapMats: "2,4,6",
        name: "Emergency Fewer Mats",
        socketMats: "6-10,12",
    },
    template2Full: {
        allMats: "1-58",
        facilityId: 0,
        handicapMats: "2,4,6",
        name: "Standard Mats",
        socketMats: "6-10,12",
    },

};

describe('Template Controller Tests', () => {

    // Testing Hooks ---------------------------------------------------------

    before("#init", async () => {
//        console.log("#init running");
        await Facility.sync({
            force: true
        });
        await Template.sync({
            force: true
        });
    });

    beforeEach("#erase", async () => {
//        console.log("#erase running");
        await Template.destroy({
            cascade: true,
            truncate: true
        });
        await Facility.destroy({
            cascade: true,
            truncate: true
        });
    });

    // Testing Methods -------------------------------------------------------

    describe("#delete()", () => {

        context("one object", () => {

            it("should destroy one object when specified by id", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1data = {
                    ...dataset.template1Full
                };
                template1data.facilityId = facility1.id;
                let template1 = await Template.create(template1data);

                let count = await Template.count({});
                expect(count).to.equal(1);
                let result = await controller.delete(template1.id);
                expect(result.name).to.equal(template1.name);
                count = await Template.count({});
                expect(count).to.equal(0);

            });

            it("should fail if there is no object for this id", async () => {

                let id = 9999;
                try {
                    await controller.delete(id);
                    expect.fail("Should have thrown NotFound error");
                } catch (err) {
                    let expected = "id: Missing Template " + id;
                    expect(err.message).includes(expected);
                }

            });

        });

    });

    describe("#deleteAll()", () => {

        context("all objects", () => {

            it("should destroy all objects when present", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let templatesData = [
                    dataset.template1Full,
                    dataset.template2Full
                ];
                templatesData[0].facilityId = facility1.id;
                templatesData[1].facilityId = facility1.id;
                await Template.bulkCreate(templatesData, {
                    validate: true
                });

                let count = await(controller.deleteAll());
                expect(count).to.equal(2);

            });

            it("should destroy zero objects when not present", async () => {

                let count = await(controller.deleteAll());
                expect(count).to.equal(0);

            });

        });

    });

    describe("findAll()", () => {

        context("all objects", () => {

            it("should find all objects", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let templatesData = [
                    dataset.template1Full,
                    dataset.template2Full
                ];
                templatesData[0].facilityId = facility1.id;
                templatesData[1].facilityId = facility1.id;
                await Template.bulkCreate(templatesData, {
                    validate: true
                });
                let count = await(Template.count({}));
                expect(count).to.equal(2);

                let templatesResult = await controller.findAll();
                expect(templatesResult.length).to.equal(2);

            });

            // TODO - the following three tests are skipped because SQLITE
            // TODO - does not support ILIKE and has no easy way to do case
            // TODO - insensitive matches

            it.skip("should find all objects by wildcard match", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let templatesData = [
                    dataset.template1Full,
                    dataset.template2Full
                ];
                templatesData[0].facilityId = facility1.id;
                templatesData[1].facilityId = facility1.id;
                await controller.bulkCreate(templatesData, {
                    validate: true
                });
                let count = await(controller.count({}));
                expect(count).to.equal(2);

                let templatesResult = await controller.findAll("mats");
                expect(templatesResult.length).to.equal(2);

            });

            it.skip("should find one object by more specific match", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let templatesData = [
                    dataset.template1Full,
                    dataset.template2Full
                ];
                templatesData[0].facilityId = facility1.id;
                templatesData[1].facilityId = facility1.id;
                await controller.bulkCreate(templatesData, {
                    validate: true
                });
                let count = await(controller.count({}));
                expect(count).to.equal(2);

                let templatesResult = await controller.findAll("Emergency");
                expect(templatesResult.length).to.equal(1);

            });

            it.skip("should find zero objects by mismatch", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let templatesData = [
                    dataset.template1Full,
                    dataset.template2Full
                ];
                templatesData[0].facilityId = facility1.id;
                templatesData[1].facilityId = facility1.id;
                await controller.bulkCreate(templatesData, {
                    validate: true
                });
                let count = await(controller.count({}));
                expect(count).to.equal(2);

                let templatesResult = await controller.findAll("foo");
                expect(templatesResult.length).to.equal(0);

            });

        });

    });

    describe("#findOne()", () => {

        context("one object", () => {

            it("should find one object by valid id", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1Data = {
                    ...dataset.template1Full
                };
                template1Data.facilityId = facility1.id;
                let template1 = await Template.create(template1Data);

                let result1 = await controller.findOne(template1.id);
                expect(result1).is.not.null;
                expect(result1.name).is.equal(dataset.template1Full.name);

            });

            it("should fail on object with invalid id", async () => {

                let id = 9999;
                try {
                    await controller.findOne(id);
                    expect.fail("Should have thrown not found error");
                } catch (err) {
                    let expected = "id: Missing Template " + id;
                    expect(err.message).includes(expected);
                }

            });

        });

    });

    describe("#insert()", () => {

        context("with duplicate name", () => {

            it("should cause validation error", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1Data = {
                    ...dataset.template1Full
                };
                template1Data.facilityId = facility1.id;
                let template1 = await Template.create(template1Data);

                try {
                    await controller.insert(template1Data);
                    expect.fail("Should have thrown validation error");
                } catch (err) {
                    expect(err.message).includes("Name '" +
                        template1.name + "' is already in use");
                }

            });

        });

        context("with empty name", () => {

            it("should cause validation error", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1Data = {
                    ...dataset.template1Full
                };
                template1Data.facilityId = facility1.id;
                delete template1Data.name;

                try {
                    await controller.insert(template1Data);
                    expect.fail("Should have thrown validation error");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

        });

        context("with full arguments", () => {

            it("should add one full object", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1Data = {
                    ...dataset.template1Full
                };
                template1Data.facilityId = facility1.id;

                let template1 = await controller.insert(template1Data);
                expect(template1.name).to.equal(template1Data.name);

            });

        });

    });

    describe("#update()", () => {

        context("one object", () => {

            it("should fail trying to change name to one already in use", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1Data = {
                    ...dataset.template1Full
                };
                template1Data.facilityId = facility1.id;
                let template1 = await Template.create(template1Data);
                expect(template1.name).to.equal(template1Data.name);

                let template2Data = {
                    ...dataset.template2Full
                };
                template2Data.facilityId = facility1.id;
                let template2 = await Template.create(template2Data);
                expect(template2.name).to.equal(template2Data.name);

                template2.name = template1.name;
                try {
                    await controller.update(template2.id, template2.dataValues);
                    expect.fail("Should have thrown already in use exception");
                } catch (err) {
                    expect(err.message).includes("Name '" +
                        dataset.template1Full.name + "' is already in use");
                }

            });

            it("should update one full object", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1Data = {
                    ...dataset.template1Full
                };
                template1Data.facilityId = facility1.id;
                let template1 = await Template.create(template1Data);
                expect(template1.name).to.equal(template1Data.name);

                template1.name = template1Data.name + " Updated";
                await controller.update(template1.id, template1.dataValues);

            });

        });

    });

});
