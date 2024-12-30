const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const CSV_FILE = path.join(__dirname, '../data/experiences.csv');
const CSV_HEADERS = ['id', 'year', 'title', 'subtitle', 'description', 'details'];

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

const writeCSV = async (experiences) => {
    const csvContent = [
        CSV_HEADERS.join(','),
        ...experiences.map(exp => 
            CSV_HEADERS.map(header => escapeCSV(exp[header])).join(',')
        )
    ].join('\n');
    await fs.writeFile(CSV_FILE, csvContent);
};

// Routes remain the same
router.get('/', async (req, res) => {
    try {
        const experiences = await readCSV();
        res.json(experiences);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const experiences = await readCSV();
        const newExperience = {
            id: Date.now().toString(),
            ...req.body
        };
        experiences.push(newExperience);
        await writeCSV(experiences);
        res.status(200).json(newExperience);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const experiences = await readCSV();
        const index = experiences.findIndex(exp => exp.id === req.params.id);
        if (index === -1) {
            return res.status(404).send('Experience not found');
        }
        experiences[index] = { ...experiences[index], ...req.body };
        await writeCSV(experiences);
        res.json(experiences[index]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const experiences = await readCSV();
        const filteredExperiences = experiences.filter(exp => exp.id !== req.params.id);
        if (filteredExperiences.length === experiences.length) {
            return res.status(404).send('Experience not found');
        }
        await writeCSV(filteredExperiences);
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;