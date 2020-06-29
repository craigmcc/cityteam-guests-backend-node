// Required modules
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
        max: dbConfig.pool.max,
        min: dbConfig.pool.min
    }
});

// Set up database interface
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Configure models
db.facilities = require("./facility.model.js")(sequelize, Sequelize);

// Export database interface
module.exports = db;
