const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database.js');

const About = sequelize.define('About', {
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

module.exports = About;