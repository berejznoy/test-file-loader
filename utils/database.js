const Sequelize = require('sequelize');

const DB_NAME = 'taskdb';
const USER_NAME = 'root';
const PASSWORD = '32069ad';

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
