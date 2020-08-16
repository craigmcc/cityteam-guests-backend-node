// Registration model
"use strict";

const { DataTypes, Model, Op } = require("sequelize");
var Facility; // Filled in by associate()
var Guest; // Filled in by associate()

module.exports = (sequelize) => {

    class Registration extends Model {};

    Registration.init({

        comments: {
            allowNull: true,
            type: DataTypes.STRING
        },

        facilityId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: "uniqueFacilityRegistrationDateMatNumber",
            validate: {
                isValidFacilityId: function(value, next) {
                    Facility.findByPk(value)
                        .then(facility => {
                            if (facility) {
                                next();
                            } else {
                                next("facilityId: Missing facility " + value);
                            }
                        })
                        .catch(next);
                }
            }
        },

        features: {
            allowNull: true,
            type: DataTypes.STRING
            // Auto-generated when template is exploded, so no validations
        },

        guestId: {
            allowNull: true,
            type: DataTypes.INTEGER,
            unique: "uniqueFacilityRegistrationDateMatNumber",
            validate: {
                isValidGuestId: function(value, next) {
                    if (!value) {
                        next();
                    }
                    Guest.findByPk(value)
                        .then(guest => {
                            if (guest) {
                                next();
                            } else {
                                next("guestId: Missing guest " + value);
                            }
                        })
                        .catch(next);
                }
            }
        },

        matNumber: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: "uniqueFacilityRegistrationDateMatNumber",
        },

        paymentAmount: {
            allowNull: true,
            type: DataTypes.DECIMAL,
            validate: {
                isPaymentAmountValid: function(value) {
                    if (value && (value <= 0.00)) {
                        throw new Error("paymentAmount: Must be positive");
                    }
                }
            }

        },

        paymentType: {
            allowNull: true,
            type: DataTypes.ENUM("$$", "AG", "CT", "FM", "MM", "SW"),
        },
/*
    $$ - Paid cash
    AG - Agency voucher
    CT - CityTeam
    FM - ?
    MM - Medical mat
    SW - Severe weather
 */

        registrationDate: {
            allowNull: false,
            type: DataTypes.DATEONLY,
            unique: "uniqueFacilityRegistrationDateMatNumber"
        },

        showerTime: {
            allowNull: true,
            type: DataTypes.TIME
        },

        wakeupTime: {
            allowNull: true,
            type: DataTypes.TIME
        }

    }, {

        modelName: "registration",
        sequelize,
        validate: {
            isGuestForFacility(next) {
                if (!this.guestId) {
                    next();
                }
                Guest.findByPk(this.guestId)
                    .then(guest => {
                        if (guest) {
                            if (guest.facilityId !== this.facilityId) {
                                throw new Error("guestId:  guest " + this.guestId +
                                    "does not belong to facility " + this.facilityId);
                            }
                        } else {
                            throw new Error("guestId: Missing guest " + this.guestId);
                        }
                        next();
                    })
                    .catch(next);
            },
            isPaymentAmountPresent() {
                if (this.paymentType && (this.paymentType === "$$") &&
                    (!this.paymentAmount)) {
                    throw new Error("paymentAmount: Must be specified for payment type '$$'");
                }
            },
            isUniqueDateMatNumberFacility(next) {
                let conditions = {where: {
                        facilityId: this.facilityId,
                        matNumber: this.matNumber,
                        registrationDate: this.registrationDate
                    }};
                if (this.id != null) {
                    conditions.where["id"] = {[Op.ne]: this.id};
                }
                Registration.count(conditions)
                    .then(found => {
                        return (found !== 0) ? next("matNumber: Mat number "
                            + this.matNumber + " is already used on date '"
                            + this.registrationDate + " in facility "
                            + this.facilityId)
                            : next();
                    })
                    .catch(next);
            }
            // TODO - fail if there is a current ban?
        }

    });

    Registration.associate = function(models) {
        Facility = models.Facility;
        Guest = models.Guest;
        models.Registration.belongsTo(models.Facility, {
            // name: facilityId,
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        models.Registration.belongsTo(models.Guest, {
            // name: guestId,
            foreignKey: {
                allowNull: true
            }
        });
    };

    return Registration;

}