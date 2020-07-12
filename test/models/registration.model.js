// Tests for Registration model
"use strict";

// Require modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../../app/models");
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
        comments: "Came in early",
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

            it("should fail on duplicate date/mat/facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let registration1data = {
                    ...dataset.registration1Full
                }
                registration1data.facilityId = facility1.id;
                delete registration1data.guestId;
                registration1data.matNumber = 42;
                registration1data.registrationDate = "2020-07-04";

                await Registration.create(registration1data);
                try {
                    await Registration.create(registration1data);
                    expect.fail("Should have failed on duplicate date/mat/facility");
                } catch (err) {
                    expect(err.message).includes("is already used on date");
                }

            });

            it("should fail on guestId for wrong facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1data = {
                    ...dataset.guest1Full
                }
                guest1data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1data);

                let facility2 = await Facility.create(dataset.facility2full);
                let registration2data = {
                    ...dataset.registration1Full
                }
                registration2data.facilityId = facility2.id;
                registration2data.guestId = guest1.id;

                try {
                    await Registration.create(registration2data);
                    expect.fail("Should have failed on guestId for wrong facility");
                } catch (err) {
                    expect(err.message).includes("does not belong to facility");
                }

            });

            it("should fail on invalid facilityId", async () => {

                let registration1data = {
                    ...dataset.registration2NoGuest
                }
                registration1data.facilityId = 9999;
                delete registration1data.guestId;
                try {
                    await Registration.create(registration1data);
                    expect.fail("Should have failed on invalid facilityId");
                } catch (err) {
                    expect(err.message).includes("Missing facility");
                }

            });

            it("should fail on invalid guestId", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let registration1data = {
                    ...dataset.registration2NoGuest
                }
                registration1data.facilityId = facility1.id;
                registration1data.guestId = 9999;
                try {
                    await Registration.create(registration1data);
                    expect.fail("Should have failed on invalid guestId");
                } catch (err) {
                    expect(err.message).includes("Missing guest");
                }

            });

            it ("should fail on missing facilityId", async () => {

                let registration1data = {
                    ...dataset.registration2NoGuest
                }
                delete registration1data.facilityId;
                delete registration1data.guestId;
                try {
                    await Registration.create(registration1data);
                    expect.fail("Should have failed on invalid facilityId");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

            it("should fail on missing paymentAmount", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let guest1data = {
                    ...dataset.guest1Full
                }
                guest1data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1data);

                let registration1data = {
                    ...dataset.registration1Full
                }
                registration1data.facilityId = facility1.id;
                registration1data.guestId = guest1.id;
                delete registration1data.paymentAmount;
                registration1data.paymentType = "$$";
                try {
                    await Registration.create(registration1data);
                    expect.fail("Should have failed on missing payment amount");
                } catch (err) {
                    expect(err.message).includes("Must be specified for payment type");
                }

            });

        });

    });

    describe("#update()", () => {

        context("adding guest later", () => {

            it("should pass", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let registration1data = {
                    ...dataset.registration2NoGuest
                };
                registration1data.facilityId = facility1.id;
                delete registration1data.guestId;
                let registration1 = await Registration.create(registration1data);

                let guest1data = {
                    ...dataset.guest1Full
                }
                guest1data.facilityId = facility1.id;
                let guest1 = await Guest.create(guest1data);

                registration1data.guestId = guest1.id;
                await Registration.update(registration1.dataValues, {
                    where: {id: registration1.id}
                });

            });

        });

    });

});
