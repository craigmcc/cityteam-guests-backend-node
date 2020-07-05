// Tests for facility.controller.js
'use strict';

// Required modules
const chai = require("chai");
const expect = chai.expect;

const db = require("../app/models");
const Facility = db.Facility;

const controller = require("../app/controllers/facility.controller.js");

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
        // TODO - delete()
    });

    describe("#deleteAll()", () => {
        // TODO - deleteAll()
    });

    describe("findAll()", () => {
        // TODO - findAll()
    });

    describe("#findOne()", () => {
        // TODO - findOne()
    });

    describe("#insert()", () => {

        context("with duplicate name", () => {

            it("should cause validation error", async () => {
                let result1a = await Facility.create(dataset.facility1full);
                try {
                    let result1b = await controller.insert(dataset.facility1full);
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
        // TODO - update()
    });

});
