// Import shelter log CSV file, destroying anything already there
// In production, remove the "install" script in package.json!!!
"use strict";

// Configure script
const csv = require("csv-parser");
const fs = require("fs");

// Configure database access
const db = require("./app/models");
const Facility = db.Facility;
const Guest = db.Guest;
const Registration = db.Registration;

// Path to the CSV file to be processed
const CSV = "./shelter.log.csv";

// Set up configuration information
const portlandData = {
    name: "Portland",
    address1: "526 SE Grand Ave.",
    city: "Portland",
    state: "OR",
    zipCode: "97214"
};
var portland;

// Accumulate results
var countGuestsCreated = 0;
var countRegistrationsCreated = 0;
var countRowsProcessed = 0;
var countRowsRead = 0;

// Main Processing Logic -----------------------------------------------------

importShelterLog();

async function importShelterLog() {

    var rows = [];
    fs.createReadStream(CSV)
        .pipe(csv([
            "registrationDate",
            "matNumberPlus",
            "firstName",
            "lastName",
            "paymentType",
            "bac",
            "comments",
            "exclude",
            "fm30days"
        ]))
        .on("data", (row) => rows.push(row))
        .on("end", () => {
            console.log("CSV file successfully read with " + rows.length + " rows");
        })

    await resyncDatabase();
    await createPortland();
    await processRows(rows);
    await reportResults();
}


// Support functions ---------------------------------------------------------

// Return null if there is no name, else return the guest created or retrieved
async function createGuestIfNecessary(row) {
    if ((row.firstName === "") && (row.lastName === "")) {
        return null;
    }
/*
    let guest = await Guest.findOne({
        where: {
            facilityId: portland.id,
            firstName: row.firstName,
            lastName: row.lastName
        }
    });
*/
    let guest = await Guest.findOne({
        where: {
            facility_id: portland.id,
            first_name: row.firstName,
            last_name: row.lastName
        }
    });
    if (!guest) {
        let data = {
            facilityId: portland.id,
            firstName: row.firstName,
            lastName: row.lastName
        };
        console.log("Creating guest ", data);
        try {
            guest = await Guest.create(data);
            countGuestsCreated++;
        } catch (err) {
            console.log("Error creating guest ", data);
            console.log(err);
        }
    }
    return guest;
};

async function createPortland() {
    console.log("Finding or creating Portland facility");
    portland = await Facility.findOne({
        where: { name: "Portland" }
    });
    if (portland) {
        console.log("Portland facility exists with id " + portland.id);
    } else {
        portland = await Facility.create(portlandData);
        console.log("Portland facility created with id " + portland.id);
    }
};

async function createRegistration(guest, row) {
    if (guest === null) {
        return
    }
    countRegistrationsCreated++;
    console.log("countRowsRead=" + countRowsRead + ", registrationDate=" + row.registrationDate
        + ", matNumberPlus=" + row.matNumberPlus
        + ", firstName=" + row.firstName
        + ", lastName=" + row.lastName);
}

async function processRow(row) {

    // Very first row is the column name replacements
    countRowsRead++;
    if (countRowsRead === 1) {
        console.log("Column name Replacements: ", row);
        return;
    }

    // No registrationDate or firstName starts with stars means ignore this row
    if ((row.registrationDate === "") || (row.firstName.startsWith("***"))) {
        return;
    }

    // Create guest (if necessary) then create registration
    countRowsProcessed++;
    let guest = await createGuestIfNecessary(row);
    await createRegistration(guest, row);



/*
    if (row.registrationDate) {
        let guests = await Guest.findAll({
            where: {
                facilityId: portland.id,
                firstName: row.firstName,
                lastName: row.lastName
            }
        });
        let guestId = (guests.length > 0) ? guests[0].id : null;
        if (!guestId) {
            let guestData = {
                firstName: row.firstName,
                lastName: row.lastName
            };
            console.log("Creating guest " + guestData.firstName + " " + guestData.lastName);
            let guest = await Guest.create(guestData);
            guestId = guest.id;
        }
    }
*/

    // Create the registration corresponding to this row
    // TODO

};

async function processRows(rows) {
    rows.forEach(row => processRow(row));
}

async function reportResults() {
    console.log("Created guests        = " + countGuestsCreated);
    console.log("Created registrations = " + countRegistrationsCreated);
    console.log("Processed rows        = " + countRowsProcessed);
    console.log("Read rows             = " + countRowsRead);
}

async function resyncDatabase() {

    console.log("Resync database - start");

    await db.sequelize.sync({
        force: false
    });

    let deletedRegistrations = await Registration.destroy({
        cascade: true,
        truncate: true
    });

    let deletedGuests = await Guest.destroy({
        cascade: true,
        truncate: true
    });

    let deletedFacilities = await Guest.destroy({
        cascade: true,
        truncate: true
    });

    console.log("Resync database - end");

};
