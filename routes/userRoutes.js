import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { 
    getUser, 
    updateUser,
    createFriendRequest, 
    getFriendRequest, 
    acceptFriendRequest,
    profileViews,
    suggestedFriends
 } from '../controller/userController.js';

const router = express.Router();

router.get('/:id?', userAuth, getUser);
router.put('/:id', userAuth, updateUser);
router.post('/friendRequest', userAuth, createFriendRequest);
router.post('/getFriendRequest', userAuth, getFriendRequest);
router.post('/acceptFriendRequest', userAuth, acceptFriendRequest);
router.post('/profileView', userAuth, profileViews);
router.post('suggestedFriend', userAuth, suggestedFriends);

export default router;