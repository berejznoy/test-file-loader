const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const file = sequelize.define('File', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false
  },
  extension: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mime: {
    type: Sequelize.STRING,
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
});

module.exports = file;
