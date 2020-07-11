// Facility model
"use strict";

const { Sequelize, DataTypes, Model, Op } = require('sequelize');

module.exports = (sequelize) => {

    class Facility extends Model {};

    Facility.init({

        address1: {
            type: DataTypes.STRING
        },

        address2: {
            type: DataTypes.STRING
        },

        city: {
            type: DataTypes.STRING
        },

        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isUnique: function(value, next) {
                    var conditions = {where: {
                            name : value
                        }};
                    if (this.id !== null) {
                        conditions.where["id"] = {[Op.ne]: this.id};
                    }
                    Facility.count(conditions)
                        .then(found => {
                            return (found !== 0) ? next("name: Name '" + value + "' is already in use") : next();
                        })
                        .catch(next);
                }
            }
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

    Facility.associate = function(models) {
        models.Facility.hasMany(models.Guest);
        models.Facility.hasMany(models.Registration);
        models.Facility.hasMany(models.Template);
    };

    return Facility;

};
