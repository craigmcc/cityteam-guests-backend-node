"use strict";

const { Sequelize, DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {

    class Registration extends Model {};

    Registration.init({

        comment: {
            allowNull: true,
            type: DataTypes.STRING
        },

        facilityId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: "uniqueFacilityRegistrationDateMatNumber",
            // TODO - validate foreign key reference
        },

        matNumber: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: "uniqueFacilityRegistrationDateMatNumber",
        },

        paymentAmount: {
            allowNull: false,
            type: DataTypes.DECIMAL
        },

        paymentType: {
            allowNull: false,
            type: DataTypes.ENUM("$$", "AG", "CT", "FM", "MM"),
            // TODO - validate valid code
        },

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
        sequelize

    });

    Registration.associate = function(models) {
        models.Registration.belongsTo(models.Facility, {
            // name: facilityId,
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Registration;

}