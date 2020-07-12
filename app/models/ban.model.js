// Ban model
"use strict";

const { DataTypes, Model, Op } = require("sequelize");
var Guest; // Filled in by associate()

module.exports = (sequelize) => {

    class Ban extends Model {};

    Ban.init({

        banFrom: {
            allowNull: false,
            type: DataTypes.DATEONLY
        },

        banTo: {
            allowNull: false,
            type: DataTypes.DATEONLY,
        },

        comments: {
            allowNull: true,
            type: DataTypes.STRING
        },

        guestId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                isValidGuestId: function(value, next) {
                    Guest.findByPk(value)
                        .then(guest => {
                            if (guest) {
                                next();
                            } else {
                                next("guestId: Missing guest " + value);
                            }
                        })
                        .catch(next);
                }
            }
        },

        staff: {
            allowNull: false,
            type: DataTypes.STRING
        }

    }, {

        modelName: "ban",
        sequelize,
        validate: {
            isBanDateOrderCorrect() {
                if (!this.banFrom || !this.banTo) {
                    throw new Error("Both banFrom and banTo are required");
                }
 //               if (this.banFrom.isAfter(this.banTo)) {
                if (this.banFrom > this.banTo) {
                    throw new Error("banTo must be equal to or greater than banFrom");
                }
            }
            // TODO - do we care about overlapping ban ranges?
        }

    });

    Ban.associate = function(models) {
        Guest = models.Guest;
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