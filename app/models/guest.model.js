// Guest model
"use strict";

const { Sequelize, DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {

    class Guest extends Model {};

    Guest.init({

        facilityId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: "uniqueNameWithinFacility",
            validate: {
                isFacilityIdValid : function(value, next) {
                    db.Facility.findByPk(this.facilityId)
                        .then(facility => {
                            if (facility === null) {
                                return next("facilityId: Missing facility " + this.facilityId);
                            } else {
                                return next();
                            }
                        })
                        .catch(next);
                }
            }
        },

        firstName: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
        },

        lastName: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
        }

    }, {

        modelName: "guest",
        sequelize,
        validate: {
            firstOrLastNameRequired() {
                if ((this.firstName === null) && (this.lastName === null)) {
                    throw new Error("name:  At least one of firstName and lastName is required");
                }
            },
            uniqueNameWithinFacility() {
                var conditions = {where: {
                        facilityId: this.facilityId,
                        firstName: this.firstName,
                        lastName: this.lastName
                    }};
                if (this.id != null) {
                    conditions.where["id"] = {[Op.ne]: this.id};
                }
                Guest.count(conditions)
                    .then(found => {
                        return (found !== 0) ? next("name: Name '"
                            + this.firstName + " " + this.lastName
                            + "' is already in use in this facility")
                            : next();
                    })
                    .catch(next);
            }
        }
    });

    Guest.associate = function(models) {
        models.Guest.hasMany(models.Ban);
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
