import {
    User,
    Post,
    Comment
} from '../model/index.js';

// create post
export const createPost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { description, image } = req.body;

        if (!description) {
            next('you must provide a description');
            return;
        }
        const post = new Post({
            userId,
            description,
            image
        });

        const newPost = await post.save();

        return res.status(200).json({
            success: true,
            message: 'Post created succssful',
            data: newPost
        })
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// get all post(or) get searched post
export const getPosts = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { search } = req.body;

        //find the friends of login user
        const user = await User.findById(userId);
        const friends = user?.friends?.toString().split(",") ?? [];
        friends.push(userId);

        // option i in regex: To match both lower case and upper case pattern in the string
        const posts = await Post.find(search ? { $or: [{ description: { $regex: search, $options: 'i' }, }] } : {})
            .populate({
                path: 'userId',
                select: 'firstName lastName location profileUrl',
            })
            .sort({ _id: -1 });

        const friendsPosts = posts?.filter((post) =>
            friends.includes(post?.userId?._id.toString())
        );

        const otherPosts = posts?.filter(
            (post) => !friends.includes(post?.userId?._id.toString())
        );

        let postRes = null;
        if (friendsPosts?.length > 0) {
            postRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
        } else {
            postRes = posts;
        }

        return res.status(200).json({
            success: true,
            data: postRes
        });

    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// get specific post by id
export const getPost = async (req, res, next) => {
    try {
        const id = req.params.id;

        const post = await Post.findById(id)
        .populate({
            path: 'userId',
            select: 'firstName lastName location profileUrl'
        });

        return res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

//delete post 
export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if(post) {
            await Post.deleteOne({ _id: post._id});
            return res.status(200).json({ 
                success: true,
                message: 'post deleted successfully'
            });
        } else {
            next('post not found');
            return;
        }

    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// get all post from a specific user
export const getUserPost = async (req, res, next) => {
    try {
        const id = req.params.id;

        const post = await Post.find({ userId: id }).populate({
            path: 'userId',
            select: 'firstName lastName location profileUrl'
        }).sort({ _id: -1 });

        return res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// get all comments from a specific post
export const getPostComments = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const postComments = await Comment.find({ postId }).populate({
            path: 'userId',
            select: 'firstName lastName location profileUrl'
        }).populate({
            path: 'replies.userId',
            select: 'firstName lastName location profileUrl'
        }).sort({ _id: -1 });

        return res.status(200).json({
            success: true,
            data: postComments
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// like(or) unlike a specific post
export const likePost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        // const likedUser = post.likes.filter((uid) => uid === String(userId));
        // if(!likedUser) {
        //     post.likes.push(userId);
        // } else {
        //     post.likes = post.likes.filter((uid) => uid !== String(userId));
        // }


        const index = post.likes.findIndex((uId) => uId === String(userId));

        if (index === -1) post.likes.push(userId);
        else post.likes = post.likes.filter((uId) => uId !== String(userId));

        const newPost = await Post.findByIdAndUpdate(postId, post, {
            new: true
        });

        return res.status(200).json({
            success: true,
            data: newPost
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// like(or) unlike a post comment
export const likePostComment = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.id;

        const comment = await Comment.findById(commentId);

        const index = comment.likes.findIndex((uId) => uId === String(userId));

        if (index === -1) comment.likes.push(userId);
        else comment.likes = comment.likes.filter((uId) => uId !== String(userId));

        const updated = await Comment.findByIdAndUpdate(commentId, comment, {
            new: true
        });

        return res.status(200).json({
            success: true,
            data: updated
        });

    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// create a comment for a specific post
export const commentPost = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        const { comment, from } = req.body;

        if(!comment) {
            // res.status(404).json({ message: 'Comment is required'});
            next('comment is required');
            return;
        }

        const newComment = new Comment({
            comment,
            from,
            userId,
            postId
        });

        const savedComment = await newComment.save();

        //updating comment to the post
        const post = await Post.findById(postId);
        post.comments.push(savedComment._id);

        await Post.findByIdAndUpdate(postId, post, ({
            new: true
        }));

        res.status(201).json(savedComment);

    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

// reply for a particular post comment
export const replyPostComment = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.id;
        const { comment, replyAt, from } = req.body;

        if(!comment) {
            // res.status(404).json({ message: 'Comment is required'});
            next('comment is required');
            return
        }

        const commentInfo = await Comment.findById(commentId);

        commentInfo.replies.push({
            comment,
            replyAt,
            from,
            userId,
            created_At: Date.now()
        });

        const savedCommentInfo = await commentInfo.save();
        return res.status(200).json(savedCommentInfo);
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}