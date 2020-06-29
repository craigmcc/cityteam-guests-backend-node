// Define the Facility model

const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {

    class Facility extends Model {};

    Facility.init({

        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },

        address1: {
            type: DataTypes.STRING
        },

        address2: {
            type: DataTypes.STRING
        },

        city: {
            type: DataTypes.STRING
        },

        state: {
            type: DataTypes.STRING(2)
        },

        zipCode: {
            type: DataTypes.STRING(10)
        }

    }, {

        modelName: "facility",
        sequelize

    });

    return Facility;

};
