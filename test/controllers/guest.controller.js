// Tests for Guest controller
'use strict';

// Required modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../../app/models");
const Facility = db.Facility;
const Guest = db.Guest;

const controllerUnderTest = require("../../app/controllers/guest.controller");

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
    guest1Full: {
        comments: "First Guest Comment",
        facilityId: 0,
        firstName: "Fred",
        lastName: "Flintstone"
    },
    guest2Full: {
        facilityId: 0,
        firstName: "Barney",
        lastName: "Rubble"
    },

};

describe('Guest Controller Tests', () => {

    // Testing Hooks ---------------------------------------------------------

    before("#init", async () => {
//        console.log("#init running");
        await Facility.sync({
            force: true
        });
        await Guest.sync({
            force: true
        });
    });

    beforeEach("#erase", async () => {
//        console.log("#erase running");
        await Guest.destroy({
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
                let guest1data = {
                    ...dataset.guest1Full
                };
                guest1data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1data);

                let count = await Guest.count({});
                expect(count).to.equal(1);
                let result = await controllerUnderTest.delete(guest1.id);
                expect(result.firstName).to.equal(guest1.firstName);
                expect(result.lastName).to.equal(guest1.lastName);
                count = await Guest.count({});
                expect(count).to.equal(0);

            });

            it("should fail if there is no object for this id", async () => {

                let id = 9999;
                try {
                    await controllerUnderTest.delete(id);
                    expect.fail("Should have thrown NotFound error");
                } catch (err) {
                    let expected = "id: Missing Guest " + id;
                    expect(err.message).includes(expected);
                }

            });

        });

    });

    describe("#deleteAll()", () => {

        context("all objects", () => {

            it("should destroy all objects when present", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guestsData = [
                    dataset.guest1Full,
                    dataset.guest2Full
                ];
                guestsData[0].facilityId = facility1.id;
                guestsData[1].facilityId = facility1.id;
                await Guest.bulkCreate(guestsData, {
                    validate: true
                });

                let count = await controllerUnderTest.deleteAll();
                expect(count).to.equal(2);

            });

            it("should destroy zero objects when not present", async () => {

                let count = await controllerUnderTest.deleteAll();
                expect(count).to.equal(0);

            });

        });

    });

    describe("findAll()", () => {

        context("all objects", () => {

            it("should find all objects", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guestsData = [
                    dataset.guest1Full,
                    dataset.guest2Full
                ];
                guestsData[0].facilityId = facility1.id;
                guestsData[1].facilityId = facility1.id;
                await Guest.bulkCreate(guestsData, {
                    validate: true
                });
                let count = await Guest.count({});
                expect(count).to.equal(2);

                let guestsResult = await controllerUnderTest.findAll();
                expect(guestsResult.length).to.equal(2);

            });

            // TODO - the following three tests are skipped because SQLITE
            // TODO - does not support ILIKE and has no easy way to do case
            // TODO - insensitive matches

            it.skip("should find all objects by wildcard match", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guestsData = [
                    dataset.guest1Full,
                    dataset.guest2Full
                ];
                guestsData[0].facilityId = facility1.id;
                guestsData[1].facilityId = facility1.id;
                await Guest.bulkCreate(guestsData, {
                    validate: true
                });
                let count = await Guest.count({});
                expect(count).to.equal(2);

                let guestsResult = await controllerUnderTest.findAll("red");
                expect(guestsResult.length).to.equal(1);

            });

            it.skip("should find one object by more specific match", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guestsData = [
                    dataset.guest1Full,
                    dataset.guest2Full
                ];
                guestsData[0].facilityId = facility1.id;
                guestsData[1].facilityId = facility1.id;
                await Guest.bulkCreate(guestsData, {
                    validate: true
                });
                let count = await Guest.count({});
                expect(count).to.equal(2);

                let guestsResult = await controllerUnderTest.findAll("rubble");
                expect(guestsResult.length).to.equal(1);

            });

            it.skip("should find zero objects by mismatch", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guestsData = [
                    dataset.guest1Full,
                    dataset.guest2Full
                ];
                guestsData[0].facilityId = facility1.id;
                guestsData[1].facilityId = facility1.id;
                await Guest.bulkCreate(guestsData, {
                    validate: true
                });
                let count = await Guest.count({});
                expect(count).to.equal(2);

                let guestsResult = await controllerUnderTest.findAll("foo");
                expect(guestsResult.length).to.equal(0);

            });

        });

    });

    describe("#findOne()", () => {

        context("one object", () => {

            it("should find one object by valid id", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1Data = {
                    ...dataset.guest1Full
                };
                guest1Data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1Data);

                let result1 = await controllerUnderTest.findOne(guest1.id);
                expect(result1).is.not.null;
                expect(result1.firstName).is.equal(dataset.guest1Full.firstName);
                expect(result1.lastName).is.equal(dataset.guest1Full.lastName);

            });

            it("should fail on object with invalid id", async () => {

                let id = 9999;
                try {
                    await controllerUnderTest.findOne(id);
                    expect.fail("Should have thrown not found error");
                } catch (err) {
                    let expected = "id: Missing Guest " + id;
                    expect(err.message).includes(expected);
                }

            });

        });

    });

    describe("#insert()", () => {

        context("with duplicate name", () => {

            it("should cause validation error", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1Data = {
                    ...dataset.guest1Full
                };
                guest1Data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1Data);

                try {
                    await controllerUnderTest.insert(guest1Data);
                    expect.fail("Should have thrown validation error");
                } catch (err) {
                    expect(err.message).includes("Name '" +
                        guest1.firstName + " " + guest1.lastName +
                        "' is already in use");
                }

            });

        });

        context("with empty name", () => {

            it("should cause validation error", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1Data = {
                    ...dataset.guest1Full
                };
                guest1Data.facilityId = facility1.id;
                delete guest1Data.firstName;

                try {
                    await controllerUnderTest.insert(guest1Data);
                    expect.fail("Should have thrown validation error");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

        });

        context("with full arguments", () => {

            it("should add one full object", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1Data = {
                    ...dataset.guest1Full
                };
                guest1Data.facilityId = facility1.id;

                let guest1 = await controllerUnderTest.insert(guest1Data);
                expect(guest1.firstName).to.equal(guest1Data.firstName);
                expect(guest1.lastName).to.equal(guest1Data.lastName);

            });

        });

    });

    describe("#update()", () => {

        context("one object", () => {

            it("should fail trying to change name to one already in use", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1Data = {
                    ...dataset.guest1Full
                };
                guest1Data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1Data);
                expect(guest1.firstName).to.equal(guest1Data.firstName);
                expect(guest1.lastName).to.equal(guest1Data.lastName);

                let guest2Data = {
                    ...dataset.guest2Full
                };
                guest2Data.facilityId = facility1.id;
                let guest2 = await Guest.create(guest2Data);
                expect(guest2.firstName).to.equal(guest2Data.firstName);
                expect(guest2.lastName).to.equal(guest2Data.lastName);

                guest2.firstName = guest1.firstName;
                guest2.lastName = guest1.lastName;
                try {
                    await controllerUnderTest.update(guest2.id, guest2.dataValues);
                    expect.fail("Should have thrown already in use exception");
                } catch (err) {
                    expect(err.message).includes("Name '" +
                        dataset.guest1Full.firstName + " " +
                        dataset.guest1Full.lastName + "' is already in use");
                }

            });

            it("should update one full object", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1Data = {
                    ...dataset.guest1Full
                };
                guest1Data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1Data);
                expect(guest1.firstName).to.equal(guest1Data.firstName);
                expect(guest1.lastName).to.equal(guest1Data.lastName);

                guest1.firstName = guest1Data.firstName + " Updated";
                await controllerUnderTest.update(guest1.id, guest1.dataValues);

            });

        });

    });

});
