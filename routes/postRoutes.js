import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import {
    createPost,
    getPosts,
    getPost,
    getUserPost,
    getComments,
    likePost,
    likePostComment,
} from '../controller/postController.js'

const router = express.Router();

router.post('/createPost', userAuth, createPost);
router.use('/getPost', userAuth).post('/',getPosts).post('/:id', getPost);
router.use('/getUserPost/:id', userAuth, getUserPost);
router.get('/comments/:postId', getComments);
router.post('/like/:postId', userAuth, likePost);
router.post('/likeComment/:id', userAuth, likePostComment);
router.post('/replyComment/:id', userAuth, replyPostComment);


export default router;