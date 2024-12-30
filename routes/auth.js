const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const CSV_FILE = path.join(__dirname, '../data/auth.csv');
const CSV_HEADERS = ['id', 'email', 'username', 'password'];

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

const writeCSV = async (users) => {
    const csvContent = [
        CSV_HEADERS.join(','),
        ...users.map(user => 
            CSV_HEADERS.map(header => escapeCSV(user[header])).join(',')
        )
    ].join('\n');
    await fs.writeFile(CSV_FILE, csvContent);
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const users = await readCSV();
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now().toString(),
            email,
            username,
            password: hashedPassword
        };

        users.push(newUser);
        await writeCSV(users);

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const users = await readCSV();
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;