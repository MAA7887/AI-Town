const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database'); // Import the SQLite database

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// Endpoint to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists in the database
    db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (err) {
                console.error('Error querying database:', err.message);
                res.status(500).json({ success: false, message: 'Server error.' });
            } else if (row) {
                // User found
                res.json({ success: true, message: 'Login successful!' });
            } else {
                // User not found
                res.json({ success: false, message: 'Invalid credentials.' });
            }
        }
    );
});

// Endpoint to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Insert the user into the database
    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err) => {
            if (err) {
                console.error('Error inserting into database:', err.message);
                res.status(500).json({ success: false, message: 'Error registering user.' });
            } else {
                res.json({ success: true, message: 'User registered successfully!' });
            }
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
