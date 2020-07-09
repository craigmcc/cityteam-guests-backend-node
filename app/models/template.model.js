"use strict";

const { Sequelize, DataTypes, Model, Op } = require("sequelize");
const MatsList = require("../util/mats.list.js");

module.exports = (sequelize) => {

    class Template extends Model {};

    Template.init( {

        allMats: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isAllMatsValid: function(value, next) {
                    try {
                        new MatsList(value);
                    } catch (err) {
                        next(err.message);
                    }
                }
            }
        },

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

        handicapMats: {
            allowNull: true,
            type: DataTypes.STRING,
            validate: {
                isHandicapMatsValid: function(value, next) {
                    try {
                        new MatsList(value);
                    } catch (err) {
                        next(err.message);
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
                isSocketMatsValid: function(value, next) {
                    try {
                        new MatsList(value);
                    } catch (err) {
                        next(err.message);
                    }
                }
            }
        },

    }, {

        modelName: "template",
        sequelize,
        validate: {
            handicapMatsSubset() {
                if ((this.allMats != null) && (this.handicapMats !== null)) {
                    let parent = new MatsList(this.allMats);
                    let child = new MatsList(this.handicapMats);
                    if (!child.isSubsetOf(parent)) {
                        throw new Error("handicapMats: is not a subset of all mats");
                    }
                }
            },
            socketMatsSubset() {
                    if ((this.allMats != null) && (this.socketMats !== null)) {
                        let parent = new MatsList(this.allMats);
                        let child = new MatsList(this.socketMats);
                        if (!child.isSubsetOf(parent)) {
                            throw new Error("socketMats: is not a subset of all mats");
                        }
                    }
            },
            uniqueNameWithinFacility() {
                var conditions = {where: {
                        facilityId: this.facilityId,
                        name: this.name
                    }};
                if (this.id != null) {
                    conditions.where["id"] = {[Op.ne]: this.id};
                }
                Template.count(conditions)
                    .then(found => {
                        return (found !== 0) ? next("name: Name '" + this.name + "' is already in use in this facility") : next();
                    })
                    .catch(next);
            }
        }

    });

    Template.associate = function(models) {
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

