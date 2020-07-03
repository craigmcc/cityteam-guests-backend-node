// Set up test database environment ------------------------------------------
const Sequelize = require("sequelize");
const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
//    logging: console.log,
    logging: false,
    storage: './test/database.sqlite'
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;


