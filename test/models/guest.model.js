// Tests for Guest model
"use strict";

// Require modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../../app/models");
const Facility = db.Facility;
const Guest = db.Guest;

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
        comments: "Husband of Wilma",
        facilityId: 0,
        firstName: "Fred",
        lastName: "Flintstone"
    },
    guest2Full: {
        comments: "Husband of Betty",
        facilityId: 0,
        firstName: "Barney",
        lastName: "Rubble"
    },
    guest3Full: {
        facilityId: 0,
        firstName: "Wilma",
        lastName: "Flintstone"
    },

};

describe("Guest Model Tests", function() {

    // Testing Hooks ---------------------------------------------------------

    before("#init", async() => {
//        console.log("#init running");
        await Facility.sync({
            force: true
        });
        await Guest.sync({
            force: true
        });
    });

    beforeEach("#erase", async() => {
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

    describe("#create()", () => {

        context("with correct information", () => {

            it("should pass with all information", async() => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                await Guest.create(data1);

            });

            it("should pass with two guests with same last name", async() => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                await Guest.create(data1);

                let data3 = {
                    ...dataset.guest3Full
                };
                data3.facilityId = facility1.id;
                await Guest.create(data3);

            });

        });

        context("with duplicate name", () => {

            it("should fail in same facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                await Guest.create(data1);

                try {
                    await Guest.create(data1);
                    expect.fail("Should have failed on duplicate name in same facility");
                } catch(err) {
                    expect(err.message).includes("is already in use within this facility");
                }

            });

            it("should pass in different facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                await Guest.create(data1);

                let facility2 = await Facility.create(dataset.facility2full);
                let data2 = {
                    ...dataset.guest1Full
                };
                data2.facilityId = facility2.id;
                await Guest.create(data2);

            });

        });

        context("with incorrect facilityId", () => {

            it("should fail with invalid facilityId", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = 9999;

                try {
                    await Guest.create(data1);
                    expect.fail("Should have failed on invalid facilityId");
                } catch (err) {
                    expect(err.message).includes("Missing facility");
                }

            });

            it("should fail with missing facilityId", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                delete data1.facilityId;

                try {
                    await Guest.create(data1);
                    expect.fail("Should have failed on missing facilityId");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

        });

        context("with incorrect name", () => {

            it("should fail with missing firstName", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                delete data1.firstName;

                try {
                    await Guest.create(data1);
                    expect.fail("Should have failed on missing firstName");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

            it ("should fail with missing lastName", async() => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                delete data1.lastName;

                try {
                    await Guest.create(data1);
                    expect.fail("Should have failed on missing lastName");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

        });

    });

    describe("#update()", () => {

        context("change name", () => {

            it("should fail with duplicate name within facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                await Guest.create(data1);

                let data2 = {
                    ...dataset.guest2Full
                };
                data2.facilityId = facility1.id;
                let guest2 = await Guest.create(data2);

                guest2.firstName = data1.firstName;
                guest2.lastName = data1.lastName;
                try {
                    await Guest.update(guest2.dataValues, {
                        where: {id: guest2.id}
                    });
                    expect.fail("Should have failed on duplicate name within facility");
                } catch (err) {
                    expect(err.message).includes("is already in use within this facility");
                }

            });

            it("should pass with new name unique within facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                await Guest.create(data1);

                let data2 = {
                    ...dataset.guest2Full
                };
                data2.facilityId = facility1.id;
                let guest2 = await Guest.create(data2);

                guest2.firstName = data1.firstName;
                guest2.lastName = data1.lastName + " Updated";
                await Guest.update(guest2.dataValues, {
                    where: {id: guest2.id}
                });

            })

            it("should pass with new name used in other facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.guest1Full
                };
                data1.facilityId = facility1.id;
                await Guest.create(data1);

                let facility2 = await Facility.create(dataset.facility2full);
                let data2 = {
                    ...dataset.guest2Full
                };
                data2.facilityId = facility2.id;
                let guest2 = await Guest.create(data2);

                guest2.firstName = data1.firstName;
                guest2.lastName = data1.lastName;
                await Guest.update(guest2.dataValues, {
                    where: {id: guest2.id}
                });

            });

        });

    });

});
