"use strict";

const { Sequelize, DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {

    class Ban extends Model {};

    Ban.init({

        banComment: {
            allowNull: true,
            type: DataTypes.STRING
        },

        banFrom: {
            allowNull: false,
            type: DataTypes.DATEONLY
        },

        banTo: {
            allowNull: false,
            type: DataTypes.DATEONLY,
        },

        guestId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            // TODO - validate foreign key reference
        },

        staff: {
            allowNull: false,
            type: DataTypes.STRING
        }

    }, {

        modelName: "ban",
        sequelize,
        validate: {
            banDateOrder() {
                if ((this.banFrom === null) || (this.banTo === null)) {
                    throw new Error("Both banFrom and banTo are required");
                }
                if (this.banFrom.isAfter(this.banTo)) {
                    throw new error("banTo must be equal to or greater than banFrom");
                }
            }
        }

    });

    Ban.associate = function(models) {
        models.Ban.belongsTo(models.Guest, {
            // name: guestId,
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Ban;

}