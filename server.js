const express = require('express');
const cors = require('cors');
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

const startServer = async () => {
    try {
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