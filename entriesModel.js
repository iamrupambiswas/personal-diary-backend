import { pool } from './index.js';  // Import the pool from index.js

// Function to fetch all entries for a specific user
export const getEntriesByUserId = async (userId) => {
    try {
        const result = await pool.query("SELECT * FROM entries WHERE user_id = $1 ORDER BY date DESC", [userId]);
        return result.rows;
    } catch (err) {
        throw new Error('Failed to fetch entries');
    }
};

// Function to fetch a single entry by ID
export const getEntryById = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM entries WHERE id = $1", [id]);
        return result.rows;
    } catch (err) {
        throw new Error('Failed to fetch entry');
    }
};

// Function to create a new entry
export const createEntry = async (title, date, content, userId) => {
    try {
        const result = await pool.query(
            'INSERT INTO entries (title, date, content, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, date, content, userId]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Failed to create entry');
    }
};

// Function to update an entry by ID
export const updateEntry = async (id, title, date, content) => {
    try {
        const result = await pool.query(
            "UPDATE entries SET title = $1, date = $2, content = $3 WHERE id = $4 RETURNING *",
            [title, date, content, id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Failed to update entry');
    }
};

// Function to delete an entry by ID
export const deleteEntry = async (id) => {
    try {
        await pool.query("DELETE FROM entries WHERE id = $1", [id]);
    } catch (err) {
        throw new Error('Failed to delete entry');
    }
};

// Function to check if an entry exists for a user
export const getEntryByIdAndUserId = async (id, userId) => {
    try {
        const result = await pool.query(
            "SELECT * FROM entries WHERE id = $1 AND user_id = $2",
            [id, userId]
        );
        return result.rows;
    } catch (err) {
        throw new Error('Failed to check entry');
    }
};


// Function to check if a user exists by username
export const checkIfUserExists = async (email) => {
    try {
        // Query the database for a user with the given email
        const result = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
        
        // Return true if the user exists, false otherwise
        return result.rowCount > 0;
    } catch (err) {
        // Log the error for debugging
        console.error('Error checking if user exists:', err);
        
        // Throw a meaningful error
        throw new Error('Database query failed while checking if user exists');
    }
};

