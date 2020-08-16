// Guest model
"use strict";

const { DataTypes, Model, Op } = require("sequelize");
var Facility; // Filled in by associate()

module.exports = (sequelize) => {

    class Guest extends Model {};

    Guest.init({

        comments: {
            allowNull: true,
            type: DataTypes.STRING
        },

        facilityId: {
            allowNull: false,
            field: "facility_id",
            type: DataTypes.INTEGER,
            unique: "uniqueNameWithinFacility",
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

        firstName: {
            allowNull: false,
            field: "first_name",
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
        },

        lastName: {
            allowNull: false,
            field: "last_name",
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
        }

    }, {

        modelName: "guest",
        sequelize,
        validate: {
/*
            isFirstOrLastNamePresent() {
                if (!this.firstName && !lastName) {
                    throw new Error("name:  At least one of firstName and lastName is required");
                }
            },
*/
            isNameUniqueWithinFacility: function(next) {
                let conditions = {where: {
                        facilityId: this.facilityId,
                        firstName: this.firstName,
                        lastName: this.lastName
                    }};
                if (this.id) {
                    conditions.where["id"] = {[Op.ne]: this.id};
                }
                Guest.count(conditions)
                    .then(found => {
                        return (found !== 0) ? next("name: Name '" +
                            this.firstName + " " + this.lastName +
                            "' is already in use within this facility") : next();
                    })
                    .catch(next);
            },
        }
    });

    Guest.associate = function(models) {
        Facility = models.Facility;
        models.Guest.hasMany(models.Ban);
        models.Guest.hasMany(models.Registration);
        models.Guest.belongsTo(models.Facility, {
            // name: facilityId,
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Guest;

};
