import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import {
    createPost,
    getPosts,
    getPost,
    deletePost, 
    getUserPost,
    getPostComments,
    likePost,
    likePostComment,
    commentPost,
    replyPostComment
} from '../controller/postController.js';

const router = express.Router();

router.post('/createPost', userAuth, createPost);
router.post('/getPost', userAuth, getPosts);
router.get('/:id', userAuth, getPost);
router.delete('/:id', userAuth, deletePost);
// router.use('/:id', userAuth).get(getPost).post(deletePost);
router.post('/getUserPost/:id', userAuth, getUserPost);
router.get('/comments/:id', getPostComments);
router.post('/like/:id', userAuth, likePost);
router.post('/likeComment/:id', userAuth, likePostComment);
router.post('/comment/:id', userAuth, commentPost);
router.post('/replyComment/:id', userAuth, replyPostComment);

export default router;