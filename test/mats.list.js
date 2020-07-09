// Tests for mats.list.js
'use strict';

const chai = require("chai");
const expect = chai.expect;
const MatsList = require("../app/util/mats.list.js");

// Single Number Lists data

// "-" means we are looking for a range, so not interpreted as negative
const cannotBeBlankSingleNumberLists = [
    "-1",
    "1,-2",
]

const mustNotContainAnEmptyItemSingleNumberLists = [
    "",
    "1,",
    "3,,5",
    ",4",
]

const mustBePositiveSingleNumberLists = [
    "0",
    "2,0",
    "3,4,0",
];

const notANumberSingleNumberLists = [
    "a",
    "1,b,3",
    "1,2,c",
];

const outOfOrderSingleNumberLists = [
    "1,1",
    "2,1",
    "1,2,2",
    "1,3,2",
];

const validSingleNumberLists = [
    "1",
    "1,2",
    "2,3,4",
    " 1 ",
    " 1 , 2 ",
    " 2 , 3, 4 ",
];

// Range List Data

const backwardsRangeLists = [
    "6-1",
    "1-3,5-4",
    "1,2,4-3",
];

const outOfOrderRangeLists = [
    "1-3,2-4",
    "1-3,2,4-5",
    "1-3,3-5",
];

const validRangeLists = [
    "1-6",
    "1-3, 4-6",
    " 1 - 4 ",
    "1-2, 4 - 6 ",
    "1,2,4,5-6",
    "1,2-2,3",
    "3,4,7-9",
]

const validRangeListsMatches = [
    "1,2,3,4,5,6",
    "1,2,3,4,5,6",
    "1,2,3,4",
    "1,2,4,5,6",
    "1,2,4,5,6",
    "1,2,3",
    "3,4,7,8,9",
]

// Subset tests
const validSubsetParents = [
    "1-3, 5, 7-8",
    "1,5-6",
    "1-7",
]

const validSubsetChilds = [
    "1,3,5,7-8",
    "1,5-6",
    "2-4,6",
]

const invalidSubsetParents = [
    "1-3, 5, 7-8",
    "1,5-6",
    "1-7",
];

const invalidSubsetChilds = [
    "4,6",
    "3,4",
    "8",
];

describe('MatsList Tests', () => {

    // Note - 'Single Number Lists' tests cover lots of cases on from and to values,
    // so we are only checking things specific to ranges
    context('Range Lists', () => {

        it("should fail must have lower number first range lists", () => {
            backwardsRangeLists.forEach((list) => {
                try {
                    let matsList = new MatsList(list);
                } catch (err) {
//                    console.log("Incoming list is: " + list);
//                    console.log("Error message is: " + err.message);
                    expect(err.message).includes("must have lower number first");
                }
            });
        });

        it("should fail out of order range lists", () => {
            outOfOrderRangeLists.forEach((list) => {
                try {
                    let matsList = new MatsList(list);
                } catch (err) {
//                    console.log("Incoming list is: " + list);
//                    console.log("Error message is: " + err.message);
                    expect(err.message).includes("is out of ascending order");
                }
            });
        });

        it("should pass valid range lists", () => {
            validRangeLists.forEach((list, i) => {
//                console.log("Incoming list is: " + list);
                let matsList = new MatsList(list);
//                console.log("Exploded list is: " + matsList.exploded());
                expect(matsList.toString()).to.equal(validRangeListsMatches[i]);
            });
        });

    });

    context('Single Number Lists', () => {

        it("should fail cannot be blank", () => {
            cannotBeBlankSingleNumberLists.forEach((list) => {
                try {
                    let matsList = new MatsList(list);
                } catch (err) {
//                    console.log("Incoming list is: " + list);
//                    console.log("Error message is: " + err.message);
                    expect(err.message).includes("cannot be blank");
                }
            })
        })

        it("should fail must be positive", () => {
            mustBePositiveSingleNumberLists.forEach((list) => {
                try {
                    let matsList = new MatsList(list);
                } catch (err) {
//                    console.log("Incoming list is: " + list);
//                    console.log("Error message is: " + err.message);
                    expect(err.message).includes("must be positive");
                }
            })
        })

        it("should fail must not contain an empty item", () => {
            mustNotContainAnEmptyItemSingleNumberLists.forEach((list) => {
                try {
                    let matsList = new MatsList(list);
                } catch (err) {
//                    console.log("Incoming list is: " + list);
//                    console.log("Error message is: " + err.message);
                    expect(err.message).includes("must not contain an empty item");
                }
            })
        })

        it("should fail not a number", () => {
            notANumberSingleNumberLists.forEach((list) => {
                try {
                    let matsList = new MatsList(list);
                } catch (err) {
//                    console.log("Incoming list is: " + list);
//                    console.log("Error message is: " + err.message);
                    expect(err.message).includes("is not a number");
                }
            })
        })

        it("should fail out of order", () => {
            outOfOrderSingleNumberLists.forEach((list) => {
                try {
                    let matsList = new MatsList(list);
                } catch (err) {
//                    console.log("Incoming list is: " + list);
//                    console.log("Error message is: " + err.message);
                    expect(err.message).includes("is out of ascending order");
                }
            })
        })

        it("should pass valid single number lists", () => {
            validSingleNumberLists.forEach((list) => {
//                console.log("Incoming list is: " + list);
                let matsList = new MatsList(list);
//                console.log("Exploded list is: " + matsList.exploded());
                expect(matsList.exploded().length).to.equal(list.split(',').length);
            });
        });

    });

    context("Subset Lists", () => {

        it("should be false", () => {
            invalidSubsetParents.forEach((parent, i) => {
                let parentList = new MatsList(parent);
                let childList = new MatsList(invalidSubsetChilds[i]);
//                console.log("parent: " + parentList.exploded());
//                console.log("child:  " + childList.exploded());
//                console.log("expect: " + "false");
//                console.log("result: " + childList.isSubsetOf(parentList))
                expect(childList.isSubsetOf(parentList)).to.be.false;
            });
        });

        it("should be true", () => {
            validSubsetParents.forEach((parent, i) => {
                let parentList = new MatsList(parent);
                let childList = new MatsList(validSubsetChilds[i]);
//                console.log("parent: " + parentList.exploded());
//                console.log("child:  " + childList.exploded());
//                console.log("expect: " + "false");
//                console.log("result: " + childList.isSubsetOf(parentList))
                expect(childList.isSubsetOf(parentList)).to.be.true;
            });
        });

    });

});
