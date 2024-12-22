const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database.js');

const Project = sequelize.define('Project', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Project;