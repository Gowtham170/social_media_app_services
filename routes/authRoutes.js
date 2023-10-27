import express from "express";
import { 
    register, 
    login, 
    logout, 
    isLoggedIn, 
    resetPassword 
} from '../controller/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/isLoggedIn', isLoggedIn);
router.put('/resetPassword', resetPassword);

export default router;