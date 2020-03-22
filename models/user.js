const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const user = sequelize.define('User', {
    "id-user": {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

});

module.exports = user;
