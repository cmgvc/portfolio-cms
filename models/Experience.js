const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database.js');

const Experience = sequelize.define('Experience', {
    year: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})