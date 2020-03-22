const Sequelize = require('sequelize');
const {dbConnection} = require('../config/main');
const {dbName, userName, password, host, dialect, logging } = dbConnection;


const sequelize = new Sequelize(dbName, userName, password, {
  host,
  dialect,
  logging
});

module.exports = sequelize;
