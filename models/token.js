const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const token = sequelize.define('Token', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    idToken: {
        allowNull: false,
        type: Sequelize.STRING
    },
    idRefreshToken: {
        allowNull: false,
        type: Sequelize.STRING
    },
    idUser: {
        allowNull: false,
        type: Sequelize.STRING
    },
});

module.exports = token;
