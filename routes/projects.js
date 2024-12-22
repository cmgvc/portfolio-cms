const express = require('express');
const router = express.Router();

const Project = require('../models/Project');

// Get all projects from the database
router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Add a new project to the database
router.post('/', async (req, res) => {
    try {
        const project = Project.create(req.body);
        res.status(200).json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Update a project in the database
router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        project.title = req.body.title;
        project.description = req.body.description;
        project.organization = req.body.organization;
        project.duration = req.body.duration;
        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Delete a project from the database
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        await project.destroy();
        res.json({message: 'Project deleted successfully'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;