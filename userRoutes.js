import express from 'express';
import { generateToken, hashPassword, comparePassword } from './auth.js';
import { pool } from './index.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { checkIfUserExists } from './entriesModel.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the email exists
        const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already taken' });
        }

        // Hash the password and insert the user
        const hashedPassword = await hashPassword(password);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;  // Change to accept email and password

    console.log('Received login request for email:', email);

    try {
        // Query the database for a user with the provided email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // Check if the user exists
        if (result.rows.length === 0) {
            console.log('User not found:', email);
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        console.log('User found:', user);

        // Compare the provided password with the stored hash
        const isMatch = await comparePassword(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            console.log('Invalid credentials for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate the token
        const token = generateToken(user.id);
        console.log('JWT Token generated:', token);

        // Send back the token as the response
        res.status(200).json({ message: 'Login successful', token, user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
});


router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, user ${req.user.id}. You have access to this route.` });
});

export default router;