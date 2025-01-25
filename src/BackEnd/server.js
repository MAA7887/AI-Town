const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Import Axios
const db = require('./database'); // Import the SQLite database

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2'; // Replace with the model you choose
const HF_API_KEY = 'YOUR_HUGGING_FACE_API_KEY'; // Replace with your Hugging Face API key

// Define characters and their roles
const characters = {
    farmer: {
        role: 'farmer',
        personality: 'You are a knowledgeable farmer who loves to share tips about agriculture.',
        history: [],
    },
    teacher: {
        role: 'teacher',
        personality: 'You are a patient teacher who enjoys explaining concepts to students.',
        history: [],
    },
    // Add more characters as needed
};

// Function to get AI response from Hugging Face
async function getAIResponse(prompt) {
    try {
        return "Ayo Whats up my guy!";
        // const response = await axios.post(HF_API_URL, {
        //     inputs: prompt,
        // }, {
        //     headers: {
        //         'Authorization': `Bearer ${HF_API_KEY}`,
        //         'Content-Type': 'application/json',
        //     },
        // });
        // return response.data[0].generated_text; // Adjust based on the API response structure
    } catch (error) {
        console.error('Error getting AI response:', error.message);
        return 'Sorry, I could not generate a response.';
    }
}

// Endpoint to handle chat between characters
app.post('/chat', async (req, res) => {
    const { message, characterRole } = req.body;

    // Get the character's context and history
    const character = characters[characterRole];
    if (!character) {
        return res.status(400).json({ response: 'Character not found.' });
    }

    // Construct the prompt with personality and previous messages
    const prompt = `${character.personality}\nPrevious messages:\n${character.history.join('\n')}\nUser: ${message}\nAI:`;

    // Get AI response
    const aiResponse = await getAIResponse(prompt);

    // Update the character's history
    character.history.push(`User: ${message}`);
    character.history.push(`AI: ${aiResponse}`);

    // Respond to the client
    res.json({ response: aiResponse });
});

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