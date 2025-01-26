import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './userRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js'; // Import the authMiddleware
import * as queries from './entriesModel.js'; // Import the queries module

const app = express();
const port = 3000;
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

// Setup the PostgreSQL database connection pool
export const pool = new pkg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// GET /entries route to fetch user-specific data
app.get('/entries', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Get user id from the decoded token

    try {
        const entries = await queries.getEntriesByUserId(userId);
        console.log("Fetched entries: ", entries);
        res.json(entries);
    } catch (err) {
        console.error('Error fetching entries:', err);
        res.status(500).send('Failed to fetch entries');
    }
});

// GET /entry/:id route to fetch a single entry
app.get('/entry/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const entry = await queries.getEntryById(id);

        if (entry.length === 0) {
            return res.status(404).json({ error: "Entry not found or unauthorized" });
        }

        console.log("Fetched entry: ", entry);
        res.json(entry[0]);
    } catch (err) {
        console.error('Error fetching entry:', err);
        res.status(500).send('Failed to fetch entry');
    }
});

// POST /entries route to create a new entry
app.post('/entries', authMiddleware, async (req, res) => {
    const { title, date, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const newEntry = await queries.createEntry(title, date, content, userId);
        res.json(newEntry);
    } catch (err) {
        console.error('Error creating entry:', err);
        res.status(500).send('Failed to create entry');
    }
});

// PUT /entries/:id route to update an entry
app.put('/entries/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, date, content } = req.body;
    const userId = req.user.id;

    try {
        const entry = await queries.getEntryByIdAndUserId(id, userId);

        if (entry.length === 0) {
            console.log("No entry found for this ID or user is unauthorized.");
            return res.status(404).json({ error: 'Entry not found or unauthorized' });
        }

        const updatedEntry = await queries.updateEntry(id, title, date, content);
        res.json(updatedEntry);
    } catch (err) {
        console.error('Error updating entry:', err);
        res.status(500).send(`Error: ${err.message}`);
    }
});

// DELETE /entries/:id route to delete an entry
app.delete('/entries/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const entry = await queries.getEntryByIdAndUserId(id, userId);

        if (entry.length === 0) {
            return res.status(404).json({ error: 'Entry not found or unauthorized' });
        }

        await queries.deleteEntry(id);
        res.json({ message: "Entry deleted successfully" });
    } catch (err) {
        console.error('Error deleting entry:', err);
        res.status(500).send('Failed to delete entry');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
