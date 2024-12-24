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
        about.description2 = req.body.description2;
        about.hobbies = req.body.hobbies;
        about.skills = req.body.skills;
        await about.save();
        res.json(about);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Add a new about section
router.post('/', async (req, res) => {
    try {
        const { description, description2, hobbies, skills } = req.body;

        // Create a new about entry
        const newAbout = await About.create({
            description,
            description2,
            hobbies,
            skills
        });

        res.status(201).json(newAbout);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/update-about-description', async (req, res) => {
    const { description, newDescription2 } = req.body; // Identify the record by 'description' or another unique field
  
    try {
      // Find the record based on the description field (or any unique field)
      const about = await About.findOne({
        where: {
          description: description, // Change this to the field you can identify with
        },
      });
  
      if (!about) {
        return res.status(404).send('About record not found');
      }
  
      // Update the description2 field
      about.description2 = newDescription2;
      await about.save();
  
      res.status(200).send('About updated successfully');
    } catch (error) {
      res.status(500).send('Error updating About');
    }
  });
  
  

module.exports = router;