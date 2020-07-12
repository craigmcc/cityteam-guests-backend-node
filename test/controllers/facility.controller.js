// Tests for Facility controller
'use strict';

// Required modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../../app/models");
const Facility = db.Facility;

const controller = require("../../app/controllers/facility.controller");

// Test data
const dataset = {
    facility1full: {
        name: 'First Facility',
        address1: 'First Address 1 Controller',
        address2: 'First Address 2',
        city: 'First City',
        state: 'OR',
        zipCode: '99999'
    },
    facility1noName: {
        address1: 'First Address 1 Controller',
        address2: 'First Address 2',
        city: 'First City',
        state: 'OR',
        zipCode: '99999'
    },
    facility2full: {
        name: 'Second Facility',
        address1: 'Second Address 1 Controller',
        address2: 'Second Address 2',
        city: 'Second City',
        state: 'WA',
        zipCode: '88888'
    },
    facility3full: {
        name: 'Third Facility',
        address1: 'Third Address 1 Controller',
        address2: 'Third Address 2',
        city: 'Third City',
        state: 'CA',
        zipCode: '77777'
    }
};

describe('Facility Controller Tests', () => {

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

    describe("#delete()", () => {

        context("one object", () => {

            it("should destroy one object when specified by id", async () => {

                let data = await Facility.create(dataset.facility1full);
                let count = await Facility.count({});
                expect(count).to.equal(1);
                let result = await controller.delete(data.id);
                expect(result.name).to.equal(data.name);
                count = await Facility.count({});
                expect(count).to.equal(0);

            });

            it("should fail if there is no object for this id", async () => {

                let id = 9999;
                try {
                    await controller.delete(id);
                    expect.fail("Should have thrown NotFound error");
                } catch (err) {
                    let expected = "id: Missing Facility " + id;
                    expect(err.message).includes(expected);
                }

            });

        });

    });

    describe("#deleteAll()", () => {

        context("all objects", () => {

            it("should destroy all objects when present", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                await Facility.bulkCreate(data, {
                    validate: true
                });

                let count = await(controller.deleteAll());
                expect(count).to.equal(3);

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

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                await Facility.bulkCreate(data, {
                    validate: true
                });

                let results = await controller.findAll();
                expect(results.length).to.equal(3);

            });

        // TODO - the following three tests are skipped because SQLITE
        // TODO - does not support ILIKE and has no easy way to do case
        // TODO - insensitive matches

            it.skip("should find all objects by wildcard match", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                await Facility.bulkCreate(data, {
                    validate: true
                });

                let results = await controller.findAll("acili");
                expect(results.length).to.equal(3);

            });

            it.skip("should find one object by more specific match", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                await Facility.bulkCreate(data, {
                    validate: true
                });

                let results = await controller.findAll("irst");
                expect(results.length).to.equal(1);

            });

            it.skip("should find zero objects by mismatch", async () => {

                let data = [
                    dataset.facility1full,
                    dataset.facility2full,
                    dataset.facility3full
                ];
                await Facility.bulkCreate(data, {
                    validate: true
                });

                let results = await controller.findAll("nada");
                expect(results.length).to.equal(0);

            });

        });

    });

    describe("#findOne()", () => {

        context("one object", () => {

            it("should find one object by valid id", async () => {

                let data = await Facility.create(dataset.facility3full, {
                    validate: true
                });

                let result = await controller.findOne(data.id);
                expect(result).is.not.null;
                expect(result.id).is.equal(data.id);

            });

            it("should fail on object with invalid id", async () => {

                let id = 9999;
                try {
                    await controller.findOne(id);
                    expect.fail("Should have thrown not found error");
                } catch (err) {
                    let expected = "id: Missing Facility " + id;
                    expect(err.message).includes(expected);
                }

            });

        });

    });

    describe("#insert()", () => {

        context("with duplicate name", () => {

            it("should cause validation error", async () => {

                let result1a = await Facility.create(dataset.facility1full);
                try {
                    await controller.insert(dataset.facility1full);
                    expect.fail("Should have thrown validation error");
                } catch (err) {
                    expect(err.message).includes("Name '" +
                    result1a.name + "' is already in use");
                }

            });

        });

        context("with empty name", () => {

            it("should cause validation error", async () => {

                try {
                    let result = await controller.insert(dataset.facility1noName);
                    expect.fail("Should have thrown validation error");
                } catch (err) {
                    expect(err.message).includes("facility.name cannot be null");
                }

            });

        });

        context("with full arguments", () => {

            it("should add one full object", async () => {

                let data1 = await controller.insert(dataset.facility1full);
                let result1 = await controller.findOne(data1.id);
                expect(result1).to.not.be.null;
                let count1 = await Facility.count({});
                expect(count1).to.equal(1);

            });

            it("should add two full objects", async () => {

                let data1 = await controller.insert(dataset.facility1full);
                let result1 = await controller.findOne(data1.id);
                expect(result1).to.not.be.null;
                let count1 = await Facility.count({});
                expect(count1).to.equal(1);

                let data2 = await controller.insert(dataset.facility2full);
                let result2 = await controller.findOne(data2.id);
                expect(result2).to.not.be.null;
                let count2 = await Facility.count({});
                expect(count2).to.equal(2);

            });

            it("should add three full objects", async () => {

                let data1 = await controller.insert(dataset.facility1full);
                let result1 = await controller.findOne(data1.id);
                expect(result1).to.not.be.null;
                let count1 = await Facility.count({});
                expect(count1).to.equal(1);

                let data2 = await controller.insert(dataset.facility2full);
                let result2 = await controller.findOne(data2.id);
                expect(result2).to.not.be.null;
                let count2 = await Facility.count({});
                expect(count2).to.equal(2);

                let data3 = await controller.insert(dataset.facility3full);
                let result3 = await controller.findOne(data3.id);
                expect(result3).to.not.be.null;
                let count3 = await Facility.count({});
                expect(count3).to.equal(3);

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
                data.name = dataset.facility1full.name;
                try {
                    let result2a = await controller.update(result2.id, data);
                    expect.fail("Should have thrown unique exception");
                } catch (err) {
                    expect(err.message).includes("Name '" +
                        dataset.facility1full.name + "' is already in use");
                }

            });

            it("should fail trying to violate validation rules", async () => {

                let result = await Facility.create(dataset.facility1full);
                let data = {
                    ...dataset.facility1full
                };
                data.name = null;
                try {
                    await controller.update(result.id, data);
                    expect.fail("Should have thrown not null exception");
                } catch (err) {
                    expect(err.message).includes("facility.name cannot be null");
                }

            });

            it("should update one full object", async () => {

                let result1 = await Facility.create(dataset.facility1full);
                let data = {
                    ...dataset.facility1full
                };
                data.address1 = data.address1 + " Updated";
                let result2 = await controller.update(result1.id, data);
                expect(result2.address1).to.equal(dataset.facility1full.address1 + " Updated");

            });

        });

    });

});
