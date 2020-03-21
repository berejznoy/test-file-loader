const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const file = sequelize.define('File', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  fieldname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  originalname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  encoding: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mimetype: {
    type: Sequelize.STRING,
    allowNull: false
  },
  destination: {
    type: Sequelize.STRING,
    allowNull: false
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  extension: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

module.exports = file;
