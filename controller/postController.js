import {
    User,
    Post,
    Comment
} from '../model/index.js';

export const createPost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { description, image } = req.body;

        if (!description) {
            next('you must provide a description');
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
                select: 'firstName lastName location profileUrl -password',
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

        res.status(200).json({
            success: true,
            data: postRes
        });

    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

export const getPost = async (req, res, next) => {
    try {
        const id = req.params.id;

        const post = await Post.findById(id).populate({
            path: 'userId',
            select: 'firstName lastName location profileUrl -password'
        });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

export const getUserPost = async (req, res, next) => {
    try {
        const id = req.params.id;

        const post = await Post.find({ userId: id }).populate({
            path: 'userId',
            select: 'firstName lastName location profileUrl -password'
        }).sort({ _id: -1 });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const postComments = await Comment.find({ postId }).populate({
            path: 'userId',
            select: 'firstName lastName location profileUrl -password'
        }).populate({
            path: 'replies.userId',
            select: 'firstName lastName location profileUrl -password'
        }).sort({ _id: -1 });

        res.status(200).json({
            success: true,
            data: postComments
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

export const likePost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;

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

        res.status(200).json({
            success: true,
            data: newPost
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

export const likePostComment = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.commentId;


        const comment = await Comment.findById(commentId);

        const index = comment.likes.findIndex((uId) => uId === String(userId));

        if (index === -1) comment.likes.push(userId);
        else comment.likes = comment.likes.filter((uId) => uId !== String(userId));

        const updated = await Comment.findById(commentId, Comment, {
            new: true
        });

        res.status(200).json({
            success: true,
            data: updated
        });

    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}



// else {
//     const replyComments =  await Comment.findOne({_id: commentId}, {
//         replies: {
//             $elemMatch: {
//                 _id: rid,
//             }
//         },
//     });

//     const index = replyComments?.replies[0]?.likes.findIndex(
//         (i) => i === String(userId)
//     );

//     if(index === -1) {
//         replyComments.replies[0].likes.push(userId);
//     } else {
//         replyComments.replies[0].likes = replyComments.replies[0]?.likes.filter(
//             (i) => i !== String(userId)
//         );
//     }

//     const query = { _id, commentId, 'replies._id': rid};

//     const updated = {
//         $set: {
//             'replies.$.likes': replyComments.replies[0].likes,
//         }
//     }

//     const result = await Comment.updateOne(query, updated, {
//         new: true
//     });

//     res.status(200).json(result);
// }