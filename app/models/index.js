// Required modules
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = process.env.NODE_ENV === "production"
    ? new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
//        logging: console.log,
        logging: false,
        pool: {
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
            max: dbConfig.pool.max,
            min: dbConfig.pool.min
        }
    })
    : new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
//    logging: console.log,
        logging: false,
        storage: './test/database.sqlite'
    })
;

// Set up database interface
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Configure models
//db.facilities = require("./facility.model.js")(sequelize, Sequelize);
db.Facility = require("./facility.model.js")(sequelize);

// Export database interface
module.exports = db;
