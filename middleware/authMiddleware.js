import { verifyToken } from '../auth.js';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
    // console.log("Request Headers:", req.headers);
    const token = req.headers.authorization?.split(' ')[1]?.replace(/[<>]/g, '');

    // console.log("Token received:", token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        // console.log("Decoded Token:", decoded);

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(403).json({ error: 'Invalid or expired token (at auth-middleware level)' });
    }
};