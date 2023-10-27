import { User } from '../model/index.js';
import { hashString, compareString, createJWTToken, compareJWTToken } from '../util/index.js';

export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        //validating fields
        if (!(firstName || lastName || email || password)) {
            next('provide required fields!');
            return;
        }

        // checking for the existence of the user
        const userExist = await User.findOne({ email });

        if (userExist) {
            next('user already exists');
            return;
        }

        // hashing a password
        const hashedPassword = await hashString(password);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        
        user.password = undefined;

        return res.status(201).json({
            message: 'user registration successful',
            user
        });

    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //validating fields
        if (!(email || password)) {
            next('please provide user credentials!');
            return;
        }

        // checking for the existence of the user
        const user = await User.findOne({ email }).select('+password').populate({
            path: 'friends',
            select: 'firstName lastName location profileUrl -password'
        });
        if(!user) {
            next('Invalid email');
            return;
        }

        //checking the correctness of the password
        const isPasswordMatch = await compareString(password, user?.password);
        if(!isPasswordMatch) {
            next('Invalid password')
            return;
        }

        user.password = undefined;

        //creating token
        const token = await createJWTToken(user?._id, user?.email);
        return res.cookie('auth_token', token, {
            httpOnly: true
        }).status(200).json({
            message: 'Login successful',
            user
        });
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const logout = async (req, res) => {
    res.clearCookie('auth_token');
    return res.status(200).json({ message: 'logout successful' });
}

export const isLoggedIn = async (req, res) => {
    try {
        const token = req.cookies.auth_token;

        if(!token) {
            return res.json(false);
        }

        const isTokenMatch = await compareJWTToken(token);
        if(!isTokenMatch) {
            return res.json(false);
        }
        
        return res.json(true);
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (user) {
            const hashedPassword = await hashString(newPassword);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({message: 'password successfully resetted'});
        } else {
            next('email not found');
            return;
        }

    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}