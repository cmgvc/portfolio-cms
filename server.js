const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const Experience = require('./models/Experience');
const User = require('./models/User');
const Project = require('./models/Project');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());

app.use(express.json());

const experienceRoutes = require('./routes/experiences');
const projectRoutes = require('./routes/projects');
const aboutRoutes = require('./routes/about');
const authRoutes = require('./routes/auth');

app.use('/experiences', experienceRoutes);
app.use('/projects', projectRoutes);
app.use('/about', aboutRoutes);
app.use('/auth', authRoutes);

const testDBConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); 
    }
};

const startServer = async () => {
    try {
        await testDBConnection();
        await sequelize.sync();
        console.log('Models synced with the database.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error.message);
        process.exit(1);
    }
};

startServer();

app.get('/', (req, res) => {
    res.send('Welcome to Portfolio CMS');
});