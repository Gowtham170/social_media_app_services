import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { 
    getUser, 
    updateUser,
    friendRequest, 
    getfriendRequest, 
    acceptFriendRequest,
    profileViews
 } from '../controller/userController.js';

const router = express.Router();

router.use('/:id', userAuth).get(getUser).put(updateUser);
router.post('/friendRequest', userAuth, friendRequest);
router.get('/getfriendRequest', userAuth, getfriendRequest);
router.post('/acceptFriendRequest', userAuth, acceptFriendRequest);
router.post('/profileView', userAuth, profileViews)

export default router;