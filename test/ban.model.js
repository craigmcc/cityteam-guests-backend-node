// Ban model
"use strict";

// Require modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../app/models");
const Ban = db.Ban;
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

    // Fill in guestId after Guest is created
    ban1Full: {
/*
        banFrom: new Date(2020, 7, 1),
        banTo: new Date(2020, 7, 31),
*/
        banFrom: "2020-07-01",
        banTo: "2020-07-31",
        comments: "Banned for July",
        guestId: 0,
        staff: "Rescue Manager"
    },
    ban2Full: {
        banFrom: "2020-08-01",
        banTo: "2099-12-31",
        comments: "Banned permanently",
        guestId: 0,
        staff: "Recovery Manager"
    }

}

describe("Ban Model Tests", function() {

    // Testing Hooks ---------------------------------------------------------

    before("#init", async() => {
//        console.log("#init running");
        await Facility.sync({
            force: true
        });
        await Guest.sync({
            force: true
        });
        await Ban.sync({
            force: true
        });
    });

    beforeEach("#erase", async() => {
//        console.log("#erase running");
        await Ban.destroy({
            cascade: true,
            truncate: true
        });
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
                let guest1data = {
                    ...dataset.guest1Full
                };
                guest1data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1data);

                let ban1data = {
                    ...dataset.ban1Full
                };
                ban1data.guestId = guest1.id;
                await Ban.create(ban1data);

            });

            it("should pass with equal dates", async() => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1data = {
                    ...dataset.guest1Full
                };
                guest1data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1data);

                let ban1data = {
                    ...dataset.ban1Full
                };
                ban1data.banTo = ban1data.banFrom;
                ban1data.guestId = guest1.id;
                await Ban.create(ban1data);

            });

        });

        context("with incorrect guestId", () => {

            it("should fail with invalid guestId", async () => {

                let ban1data = {
                    ...dataset.ban1Full
                }
                ban1data.guestId = 9999;

                try {
                    await Ban.create(ban1data);
                    expect.fail("Should have failed on invalid guestId");
                } catch (err) {
                    expect(err.message).includes("Missing guest");
                }

            });

            it("should fail with missing guestId", async () => {

                let ban1data = {
                    ...dataset.ban1Full
                }
                delete ban1data.guestId;

                try {
                    await Ban.create(ban1data);
                    expect.fail("Should have failed on missing guestId");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

        });

    });





});
