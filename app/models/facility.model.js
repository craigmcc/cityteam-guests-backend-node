// Define the Facility model
module.exports = (sequelize, Sequelize) => {

    const Facility = sequelize.define("facility", {

        name: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true
        },

        address1: {
            type: Sequelize.STRING
        },

        address2: {
            type: Sequelize.STRING
        },

        city: {
            type: Sequelize.STRING
        },

        state: {
            type: Sequelize.STRING(2)
        },

        zipCode: {
            type: Sequelize.STRING(10)
        }

    });

    return Facility;

};
