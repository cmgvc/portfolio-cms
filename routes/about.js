const express = require('express');
const router = express.Router();
const About = require('../models/About');
const fs = require('fs').promises;
const path = require('path');

const CSV_FILE = path.join(__dirname, '../data/about.csv');
const CSV_HEADERS = ['id', 'description', 'description2', 'hobbies', 'skills'];

const escapeCSV = (field) => {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
};

const parseCSV = (line) => {
    const fields = [];
    let field = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            fields.push(field);
            field = '';
        } else {
            field += char;
        }
    }
    fields.push(field);
    return fields;
};

const readCSV = async () => {
    try {
        const data = await fs.readFile(CSV_FILE, 'utf-8');
        const lines = data.trim().split('\n');
        const headers = parseCSV(lines[0]);
        return lines.slice(1).map(line => {
            const values = parseCSV(line);
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] || '';
                return obj;
            }, {});
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(CSV_FILE, CSV_HEADERS.join(',') + '\n');
            return [];
        }
        throw error;
    }
};

const writeCSV = async (about) => {
    const csvContent = [
        CSV_HEADERS.join(','),
        ...about.map(exp => 
            CSV_HEADERS.map(header => escapeCSV(exp[header])).join(',')
        )
    ].join('\n');
    await fs.writeFile(CSV_FILE, csvContent);
};

// Get about from the database
router.get('/', async (req, res) => {
    try {
        const about = await readCSV();
        res.json(about);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
router.put('/', async (req, res) => {
  try {
      let aboutData = await readCSV();
      const updatedAbout = {
          id: aboutData.length > 0 ? aboutData[0].id : Date.now().toString(),
          ...req.body
      };
      await writeCSV([updatedAbout]); 
      res.json(updatedAbout);
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
        const about = readCSV();
        const newAbout = {
            id: Date.now().toString(),
            ...req.body
        };
        about.push(newAbout);
        await writeCSV(about);
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