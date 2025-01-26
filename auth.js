import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId) => {
    const expiresIn = process.env.JWT_EXPIRES || '1h';
    return jsonwebtoken.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    // console.log("Token: " + token)
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded JWT token:", decoded); 
        return decoded;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.error("Token has expired");
            throw new Error('Token has expired');
        }
        console.error("Error verifying token:", err);
        throw new Error('Invalid or expired token (at auth level)');
    }
};

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};