import { User } from "../model/index.js";
import { compareJWTToken } from "../util/index.js";
import dotenv from 'dotenv';

dotenv.config();

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;

        if(!token) {
            next('Access Denied: Not authorized to access this route');
            return;
        }

        const verifiedToken = await compareJWTToken(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(verifiedToken.userId);
        if(!user) {
            next('No user found');
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({message: 'Invalid Token'});
    }
}

export default userAuth;