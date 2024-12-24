const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database.js');

const About = sequelize.define('About', {
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description2: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    hobbies: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
})

module.exports = About;