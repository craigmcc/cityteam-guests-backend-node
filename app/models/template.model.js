// Template model
"use strict";

const { Sequelize, DataTypes, Model, Op } = require("sequelize");
var Facility; // Filled in by associate()
const MatsList = require("../util/mats.list");

module.exports = (sequelize) => {

    class Template extends Model {};

    Template.init( {

        allMats: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isAllMatsValid: function(value) {
                    try {
                        new MatsList(value);
                    } catch (err) {
                        throw err;
                    }
                }
            }
        },

        facilityId: {
            allowNull: false,
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

        handicapMats: {
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                isHandicapMatsValid: function(value) {
                    if (value) {
                        try {
                            new MatsList(value);
                        } catch (err) {
                            throw err;
                        }
                    }
                }
            }
        },

        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
        },

        socketMats: {
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                isSocketMatsValid: function(value) {
                    if (value) {
                        try {
                            new MatsList(value);
                        } catch (err) {
                            throw err;
                        }
                    }
                }
            }
        },

    }, {

        modelName: "template",
        sequelize,
        validate: {
            isHandicapMatsValidSubset: function() {
                if (this.allMats && this.handicapMats) {
                    let parent = new MatsList(this.allMats);
                    let child = new MatsList(this.handicapMats);
                    if (!child.isSubsetOf(parent)) {
                        throw new Error("handicapMats: is not a subset of all mats");
                    }
                }
            },
            isNameUniqueWithinFacility: function(next) {
                let conditions = {where: {
                        facilityId: this.facilityId,
                        name: this.name
                    }};
                if (this.id) {
                    conditions.where["id"] = {[Op.ne]: this.id};
                }
                Template.count(conditions)
                    .then(found => {
                        return (found !== 0) ? next("name: Name '" + this.name +
                            "' is already in use within this facility") : next();
                    })
                    .catch(next);
            },
            isSocketMatsValidSubset: function() {
                    if (this.allMats && this.socketMats) {
                        let parent = new MatsList(this.allMats);
                        let child = new MatsList(this.socketMats);
                        if (!child.isSubsetOf(parent)) {
                            throw new Error("socketMats: is not a subset of all mats");
                        }
                    }
            }
        }

    });

    Template.associate = function(models) {
        Facility = models.Facility;
        models.Template.belongsTo(models.Facility, {
            // name: "facilityId",
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Template;

};

