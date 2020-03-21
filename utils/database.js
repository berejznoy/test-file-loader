const Sequelize = require('sequelize');

const DB_NAME = 'taskdb';
const USER_NAME = 'root';
const PASSWORD = 'S32069257b';

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
