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
        sequelize,
        validate: {
            uniqueDateMatNumberFacility() {
                var conditions = {where: {
                        facilityId: this.facilityId,
                        matNumber: this.matNumber,
                        registrationDate: this.registrationDate
                    }};
                if (this.id != null) {
                    conditions.where["id"] = {[Op.ne]: this.id};
                }
                Registration.count(conditions)
                    .then(found => {
                        return (found !== 0) ? next("matNumber: Mat number "
                            + this.matNumber + " is already use on date '"
                            + this.registrationDate + " in this facility")
                            : next();
                    })
                    .catch(next);
            }
        }

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