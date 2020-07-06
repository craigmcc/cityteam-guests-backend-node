"use strict";

const { Sequelize, DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {

    class Template extends Model {};

    Template.init( {

        allMats: {
            allowNull: false,
            type: DataTypes.STRING,
            // TODO - validate valid number list pattern
        },

        electricityMats: {
            allowNull: true,
            type: DataTypes.STRING,
            // TODO - validate valid number list pattern, subset of allMats
        },

        facilityId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: "uniqueNameWithinFacility",
            // TODO - validate foreign key reference
        },

        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
            // TODO - validate that facilityId + name is unique
        }

    }, {

        modelName: "template",
        sequelize

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

