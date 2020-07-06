"use strict";

const { Sequelize, DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {

    class Guest extends Model {};

    Guest.init({

        facilityId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: "uniqueNameWithinFacility",
            // TODO - validate foreign key reference
        },

        firstName: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
            // TODO - validate that facilityId + firstName + lastName is unique
        },

        lastName: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: "uniqueNameWithinFacility",
            // TODO - validate at least one of firstName and lastName is present
            // TODO - validate that facilityId + firstName + lastName is unique
        }

    }, {

        modelName: "guest",
        sequelize

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
