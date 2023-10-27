import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { acceptFriendRequest, getfriendRequest, friendRequest, getUser, updateUser } from '../controller/userController.js';

const router = express.Router();

router.use('/:id', userAuth).get(getUser).put(updateUser);
router.post('/friendRequest', userAuth, friendRequest);
router.post('/getfriendRequest', userAuth, getfriendRequest);
router.post('/acceptFriendRequest', userAuth, acceptFriendRequest);

export default router;