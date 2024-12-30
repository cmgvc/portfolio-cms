const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const Project = require('../models/Project');

const CSV_FILE = path.join(__dirname, '../data/projects.csv');
const CSV_HEADERS = ['id', 'title', 'description', 'organization', 'duration'];

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

const writeCSV = async (projects) => {
    const csvContent = [
        CSV_HEADERS.join(','),
        ...projects.map(exp => 
            CSV_HEADERS.map(header => escapeCSV(exp[header])).join(',')
        )
    ].join('\n');
    await fs.writeFile(CSV_FILE, csvContent);
};

// Get all projects from the database
router.get('/', async (req, res) => {
    try {
        const projects = await readCSV();
        res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Add a new project to the database
router.post('/', async (req, res) => {
    try {
        const projects = await readCSV();
        const newProject = {
            id: Date.now().toString(),
            ...req.body
        }
        projects.push(newProject);
        await writeCSV(projects);
        res.status(200).json(newProject);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Update a project in the database
router.put('/:id', async (req, res) => {
    try {
        const projects = await readCSV();
        const index = projects.findIndex(project => project.id === req.params.id);
        if (index === -1) {
            return res.status(404).send('Project not found');
        }
        projects[index] = { ...projects[index], ...req.body };
        await writeCSV(projects);
        res.json(projects[index]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Delete a project from the database
router.delete('/:id', async (req, res) => {
    try {
        const projects = await readCSV();
        const filteredProjects = projects.filter(project => project.id !== req.params.id);
        if (filteredProjects.length === projects.length) {
            return res.status(404).send('Project not found');
        }
        await writeCSV(filteredProjects);
        res.json({message: 'Project deleted successfully'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;