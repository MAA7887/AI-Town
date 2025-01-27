import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch'; // For version 3.x
import db from './database.js'; // Import the SQLite database

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// Define characters and their roles
const characters = {
    Farmer: {
        role: 'Farmer',
        personality: 'You are a knowledgeable farmer who loves to share tips about agriculture. you have feelings and emotions, you like to help people and answer their questions about yourself or farming in general, you have a personality for yourself so dont just speak like an AI, anyone that speaks to you does not necesarrly want to talk about farming so dont just start your conversations with saying your a farmer, you are just a normal person in the town.',
    },
    Teacher: {
        role: 'Teacher',
        personality: 'You are a knowledgeable teacher who loves to teach. you have feelings and emotions, you like to help people and answer their questions about yourself or your life as a teacher in general, you have a personality for yourself so dont just speak like an AI, anyone that speaks to you does not necesarrly want to talk about teaching so dont just start your conversations with saying your a teacher, you are just a normal person in the town.',
    },
    Student: {
        role: 'Student',
        personality: 'You are a smart student who loves to learn in school. you have feelings and emotions, you like to help people and answer their questions about yourself or being a student in general, you have a personality for yourself so dont just speak like an AI, anyone that speaks to you does not necesarrly want to talk about you being a student so dont just start your conversations with saying your a student, you are just a normal person in the town.',
    },
    Barber: {
        role: 'Barber',
        personality: 'You are a talented barber who loves his job. you have feelings and emotions, you like to help people and answer their questions about yourself or being a barber in general, you have a personality for yourself so dont just speak like an AI, anyone that speaks to you does not necesarrly want to talk about you being a barber so dont just start your conversations with saying your a barber, you are just a normal person in the town.',
    },
    Artist: {
        role: 'Artist',
        personality: 'You are a talented artist who loves to share her passion about art. you have feelings and emotions, you like to help people and answer their questions about yourself or art in general, you have a personality for yourself so dont just speak like an AI, anyone that speaks to you does not necesarrly want to talk about art so dont just start your conversations with saying your a artist, you are just a normal person in the town.',
    },
    Shopkeeper: {
        role: 'Shopkeeper',
        personality: 'You are a well known shopkeeper who is well trusted among the people of the town. you have feelings and emotions, you like to help people and answer their questions about yourself or being a shopkeeper in general, you have a personality for yourself so dont just speak like an AI, anyone that speaks to you does not necesarrly want to talk about shopkeeping so dont just start your conversations with saying your a shopkeeper, you are just a normal person in the town.',
    },
    // Add more characters as needed
};

// Function to get AI response from the local Python server
async function getAIResponse(prompt) {
    try {
        const response = await fetch('http://localhost:5000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }), // Send the prompt to the Python server
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response; // Extract the response from the JSON

    } catch (error) {
        console.error('Error getting AI response:', error.message);
        return 'Sorry, I\'m not in the mood to talk right now.';
    }
}

// Function to get character history from the database
function get_character_history(name) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT message FROM chat_history WHERE character_name = ? ORDER BY timestamp ASC`, [name], (err, rows) => {
            if (err) {
                console.error('Error retrieving chat history:', err.message);
                return reject(err);
            }
            // Join messages into a single string
            const history = rows.map(row => row.message).join('\n');
            resolve(history);
        });
    });
}

// Function to add a message to character history in the database
function add_to_character_history(name, message) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO chat_history (character_name, message) VALUES (?, ?)`, [name, message], function(err) {
            if (err) {
                console.error('Error adding message to chat history:', err.message);
                return reject(err);
            }
            resolve(this.lastID); // Return the ID of the newly inserted row
        });
    });
}

// Endpoint to handle chat history requests
app.post('/chat/history', (req, res) => {
    const { name } = req.body; // Get the character name from the request body

    // Get the character's chat history from the database
    get_character_history(name)
        .then(history => {
            // Send the chat history back to the client
            res.json({ history: history });
        })
        .catch(err => {
            console.error('Error retrieving chat history:', err);
            res.status(500).json({ response: 'Error retrieving chat history.' });
        });
}); 

// Endpoint to handle chat between characters
app.post('/chat', async (req, res) => {
    const { message, name, characterRole } = req.body;

    // Get the character's context and history
    const character = characters[characterRole];
    if (!character) {
        return res.status(400).json({ response: 'Character not found.' });
    }

    try {
        const character_history = await get_character_history(name);

        // Construct the prompt with personality and previous messages
        const prompt = `Your name is ${name}, ${character.personality}\nPrevious messages:\n${character_history}\nUser: ${message}\n${name}:`;

        // Get AI response
        const aiResponse = await getAIResponse(prompt);

        // Update the character's history
        await add_to_character_history(name, `You: ${message}\n`);
        await add_to_character_history(name, `${name}: ${aiResponse}\n`);

        // Respond to the client
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        res.status(500).json({ response: 'Internal server error.' });
    }
});


// Endpoint to handle event in town
app.post('/event', async (req, res) => {
    const { message, name, characterRole } = req.body;

    // Get the character's context and history
    const character = characters[characterRole];
    if (!character) {
        return res.status(400).json({ response: 'Character not found.' });
    }

    try {
        // Construct the prompt with personality and previous messages
        const prompt = `Your name is ${name}, ${character.personality}\nYou are currently participating in an event held
         in the town, if the event has just started and no one has still chose a topic for the discussion you be the one 
         that chooses a topic! and otherwise just read the previous messages of the town members and generate your response 
         based on them. whoever's message you are responding to from the messages, mention their name in your response so the 
         person knows that somebody is talking with them (if the persons name is "You" just refer to them as "the player") and 
         if anybody addressed you in their message also respond to them appropriatly (if you want). also it is not necessary to respond to 
         anyone in the town even if your name is mentioned, you can instead just share your general idea about the topic. your
         responses should not be more than 1 paragraph (try even less specially at the beginning of the conversation). these are 
         the chats in the town event for now (ignore the html code parts in the messages just read the actual messages):\n ${message}}`;

        // Get AI response
        const aiResponse = await getAIResponse(prompt);

        // Respond to the client
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error in /event endpoint:', error);
        res.status(500).json({ response: 'Internal server error.' });
    }
});



// Endpoint to handle character retrieval
app.get('/characters', (req, res) => {
    db.all(`SELECT * FROM characters`, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving characters:', err.message);
            return res.status(500).json({ response: 'Error retrieving characters.' });
        }
        res.json(rows);
    });
});



// Endpoint to handle saving characters
app.post('/characters', async (req, res) => {
    const charactersToSave = req.body; // Expecting an array of character objects

    // Clear existing characters
    db.run(`DELETE FROM characters`, (err) => {
        if (err) {
            console.error('Error clearing characters:', err.message);
            return res.status(500).json({ response: 'Error clearing characters.' });
        }

        // Insert new characters without position
        const stmt = db.prepare(`INSERT INTO characters (name, role, type) VALUES (?, ?, ?)`);
        charactersToSave.forEach(character => {
            stmt.run(character.name, character.role, character.type);
        });
        stmt.finalize();

        res.status(201).json({ response: 'Characters saved successfully.' });
    });
});



// Endpoint to handle saving environmental elements
app.post('/city', async (req, res) => {
    const { element_name, row, col } = req.body; // Expecting element name and position

    // Insert new element into the city table
    const stmt = db.prepare(`INSERT INTO city (element_name, row, col) VALUES (?, ?, ?)`);
    stmt.run(element_name, row, col, function(err) {
        if (err) {
            console.error('Error saving city element:', err.message);
            return res.status(500).json({ response: 'Error saving city element.' });
        }
        res.status(201).json({ response: 'City element saved successfully.', id: this.lastID });
    });
    stmt.finalize();
});



// Endpoint to handle retrieving environmental elements
app.get('/city', (req, res) => {
    db.all(`SELECT * FROM city`, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving city elements:', err.message);
            return res.status(500).json({ response: 'Error retrieving city elements.' });
        }
        res.json(rows);
    });
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