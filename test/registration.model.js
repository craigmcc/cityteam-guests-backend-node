// Tests for Registration model
"use strict";

// Require modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../app/models");
const Facility = db.Facility;
const Guest = db.Guest;
const Registration = db.Registration;

// Test data
const dataset = {

    // Must store results of newly created Facility objects to pick up PK
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
    // Must store results of newly created Guest objects to pick up PK
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

    // Fill in facilityId and (optional) guestId after those objects are created
    registration1Full: {
        facilityId: 0,
        features: "H",
        guestId: 0,
        matNumber: 1,
        paymentAmount: 5.00,
        paymentType: "$$",
        registrationDate: "2020-07-04",
        showerTime: "03:30",
        wakeupTime: "3:00"
    },
    registration2NoGuest: {
        facilityId: 0,
        features: "HS",
        matNumber: 2,
        registrationDate: "2020-07-04"
    }

};

describe("Registration Model Tests", function() {

    // Testing Hooks ---------------------------------------------------------

    before("#init", async () => {
//        console.log("#init running");
        await Facility.sync({
            force: true
        });
        await Guest.sync({
            force: true
        });
        await Registration.sync({
            force: true
        })
    });

    beforeEach("#erase", async () => {
//        console.log("#erase running");
        await Registration.destroy({
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

            it("should pass with guest information included", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1data = {
                    ...dataset.guest1Full
                };
                guest1data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1data);

                let registration1data = {
                    ...dataset.registration1Full
                };
                registration1data.facilityId = facility1.id;
                registration1data.guestId = guest1.id;
                await Registration.create(registration1data);

            });

            it("should pass with guest information omitted", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let registration1data = {
                    ...dataset.registration2NoGuest
                };
                registration1data.facilityId = facility1.id;
                delete registration1data.guestId;
                await Registration.create(registration1data);

            });

        });

        context("with incorrect information", () => {

            it("should fail on guestId for wrong facility", async () => {
                // TODO
            });

            it("should fail on invalid facilityId", async () => {
                // TODO
            });

            it("should fail on invalid guestId", async () => {
                // TODO
            });

            it ("should fail on missing facilityId", async () => {
                // TODO
            })

            // TODO - paymentAmount versus paymentType tests

        });

    })

});
