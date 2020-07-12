// Tests for Template model
'use strict';

// Require modules
const chai = require('chai');
const expect = chai.expect;

const db = require("../app/models");
const Facility = db.Facility;
const Template = db.Template;

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

describe("Template Model Tests", function() {

    // Testing Hooks ---------------------------------------------------------

    before("#init", async() => {
//        console.log("#init running");
        await Facility.sync({
            force: true
        });
        await Template.sync({
            force: true
        });
    });

    beforeEach("#erase", async() => {
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

    describe("#create()", () => {

        context("with correct information", () => {

            it("should pass with all information", async() => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;

                await Template.create(template1);

            });

            it("should pass with missing optional information", async() => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                delete template1.handicapMats;
                delete template1.socketMats;

                await Template.create(template1);

            });

        });

        context("with duplicate name", () => {

            it("should fail in same facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                await Template.create(template1);

                let template2 = {
                    ...dataset.template1Full
                };
                template2.facilityId = facility1.id;
                try {
                    await Template.create(template2);
                    expect.fail("Should have failed on duplicate name in same facility");
                } catch (err) {
                    expect(err.message).includes("is already in use within this facility");
                }

            });

            it("should pass in different facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                await Template.create(template1);

                let facility2 = await Facility.create(dataset.facility2full);
                let template2 = {
                    ...dataset.template1Full
                };
                template2.facilityId = facility2.id;
                await Template.create(template2);

            });

        });

        context("with incorrect allMats", () => {

            it("should fail with invalid allMats", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.allMats = "1-3,abc,7";
                template1.facilityId = facility1.id;

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid allMats");
                } catch (err) {
                    expect(err.message).includes("is not a number");
                }

            });

            it("should fail with invalid allMats element", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.allMats = "1-3,,7";
                template1.facilityId = facility1.id;

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid allMats element");
                } catch (err) {
                    expect(err.message).includes("must not contain an empty item");
                }

            });

        });

        context("with incorrect facilityId", () => {

            it("should fail with invalid facilityId", async () => {

                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = 9999;

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed with missing facilityId");
                } catch (err) {
                    expect(err.message).includes("facilityId: Missing facility");
                }

            });

            it("should fail with missing facilityId", async () => {

                let template1 = {
                    ...dataset.template1Full
                };
                delete template1.facilityId;

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed with missing facilityId");
                } catch (err) {
                    expect(err.message).includes("cannot be null");
                }

            });

        });

        context("with incorrect handicapMats", () => {

            it("should fail with invalid handicapMats", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                template1.handicapMats = "1-3,abc,7";

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid handicapMats");
                } catch (err) {
                    expect(err.message).includes("is not a number");
                }

            });

            it("should fail with invalid handicapMats element", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                template1.handicapMats = "1-3,,7";

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid handicapMats element");
                } catch (err) {
                    expect(err.message).includes("must not contain an empty item");
                }

            });

            it("should fail with invalid handicapMats subset", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                template1.handicapMats = "1-25";

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid handicapMats subset");
                } catch (err) {
                    expect(err.message).includes("is not a subset of all mats");
                }

            });

        });

        context("with incorrect socketMats", () => {

            it("should fail with invalid socketMats", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                template1.socketMats = "1-3,abc,7";

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid socketMats");
                } catch (err) {
                    expect(err.message).includes("is not a number");
                }

            });

            it("should fail with invalid socketMats element", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                template1.socketMats = "1-3,,7";

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid socketMats element");
                } catch (err) {
                    expect(err.message).includes("must not contain an empty item");
                }

            });

            it("should fail with invalid socketMats subset", async () => {

                let facility1 = await Facility.create(dataset.facility1full);

                let template1 = {
                    ...dataset.template1Full
                };
                template1.facilityId = facility1.id;
                template1.socketMats = "1,2,26";

                try {
                    await Template.create(template1);
                    expect.fail("Should have failed on invalid socketMats subset");
                } catch (err) {
                    expect(err.message).includes("is not a subset of all mats");
                }

            });

        });

    });

    describe("#update()", () => {

        context("change name", () => {

            it("should fail with duplicate name within facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.template1Full
                };
                data1.facilityId = facility1.id;
                let template1 = await Template.create(data1);

                let data2 = {
                    ...dataset.template2Full
                };
                data2.facilityId = facility1.id;
                let template2 = await Template.create(data2);

                template2.name = template1.name;
                try {
                    await Template.update(template2.dataValues, {
                        where: {id: template2.id}
                    });
                    expect.fail("Should have failed on duplicate name within facility");
                } catch (err) {
                    expect(err.message).includes("is already in use within this facility");
                }

            });

            it("should pass with new name unique within facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.template1Full
                };
                data1.facilityId = facility1.id;
                let template1 = await Template.create(data1);

                template1.name = template1.name + " Updated";
                await Template.update(template1.dataValues, {
                    where: {id: template1.id}
                });

            });

            it("should pass with new name used in other facility", async () => {

                let facility1 = await Facility.create(dataset.facility1full);
                let data1 = {
                    ...dataset.template1Full
                };
                data1.facilityId = facility1.id;
                let template1 = await Template.create(data1);

                let facility2 = await Facility.create(dataset.facility2full);
                let data2 = {
                    ...dataset.template2Full
                };
                data2.facilityId = facility2.id;
                let template2 = await Template.create(data2);

                template1.name = template2.name;
                await Template.update(template1.dataValues, {
                    where: {id: template1.id}
                });

            });

        });

    });

});
