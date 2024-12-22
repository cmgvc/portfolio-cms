const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// Get all experiences from the database
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.findAll();
        res.json(experiences);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Add new experience to the database
router.post('/', async (req, res) => {
    try {
        const experience = Experience.create(req.body);
        res.status(200).json(experience);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Update an experience in the database
router.put('/:id', async (req, res) => {
    try {
        const experience = await Experience.findByPk(req.params.id);
        experience.year = req.body.year;
        experience.title = req.body.title;
        experience.subtitle = req.body.subtitle;
        experience.description = req.body.description;
        experience.details = req.body.details;
        await experience.save();
        res.json(experience);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Delete an experience from the database
router.delete('/:id', async (req, res) => {
    try {
        const experience = await Experience.findByPk(req.params.id);
        await experience.destroy();
        res.json({message: 'Experience deleted successfully'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;