import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// hashing 
export const hashString = async (value) => {
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(value, salt);
    return hashedPassword;
};

// compare hashed value
export const compareString = async (password, userPassword) => {
    const isMatch = await bcryptjs.compare(password, userPassword);
    return isMatch;
}

// generate JWT Token
export const createJWTToken = async (id, email) => {
    const payload = {
        userId: id, 
        email: email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d'
    });
    return token;
}

// compare JWT Token
export const compareJWTToken = async (token) => {
    const isMatch = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return isMatch;
} 