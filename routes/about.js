const express = require('express');
const router = express.Router();
const About = require('../models/About');

// Get about from the database
router.get('/', async (req, res) => {
    try {
        const about = await About.findAll();
        res.json(about);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Change the about description
router.put('/', async (req, res) => {
    try {
        const about = await About.findOne();
        about.description = req.body.description;
        await about.save();
        res.json(about);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;