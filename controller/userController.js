import { FriendRequest, User } from "../model/index.js";

export const getUser = async (req, res, next) => {
    try {

        const userId  = req.user._id;
        
        const user = await User.findById(req.params.id ?? userId).populate({
            path: 'friends',
            select: '-password'
        });
        if(!user) {
            next('user not found');
            return;
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.params.id);
        if(user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.location = req.body.location || user.location;
            user.profileUrl = req.body.profileUrl || user.profileUrl;
            user.profession = req.body.profession || user.profession;

            const updatedUser = await user.save();

            await user.populate({
                path: 'friends',
                select: '-password'
            });

            updatedUser.password = undefined

            return res.status(200).json({
                message: 'user updated successfully',
                updatedUser
            });
        } else {
            next('user not found');
            return;
        }
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const createFriendRequest = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { requestTo } = req.body;

        const requestExist1 = await FriendRequest.findOne({
            requestFrom: userId,
            requestTo: requestTo
        });

        if(requestExist1) {
            next('friend request already sent.');
            return;
        }

        const requestExist2 = await FriendRequest.findOne({
            requestFrom: requestTo,
            requestTo: userId
        });

        if(requestExist2) {
            next('friend request already sent.');
            return;
        }

        await FriendRequest.create({
            requestFrom: userId,
            requestTo
        });

        res.status(201).json({
            message: 'friend request sent successfully'
        })

    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const getFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const request  = await FriendRequest.find({
            requestTo: userId,
            requestStatus: 'Pending'
        }).populate({
            path: 'requestFrom',
            select: 'firstName lastName profileUrl profession',
        }).limit(10).sort({_id: -1});

        return res.status(200).json({
            data: request
        });
    } catch (error) {
        return res.status(400).json(`Error: ${error.message}`);
    }
}

export const acceptFriendRequest = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const { requestId, status } = req.body;
 
        const requestExist = await FriendRequest.findById(requestId);

        if(!requestExist) {
            next('no friend request found');
            return;
        }

        const newRes = await FriendRequest.findByIdAndUpdate({_id: requestId}, {requestStatus: status});

        if(status === 'Accepted') {
            const user = await User.findById(userId);
            user.friends.push(newRes?.requestFrom);
            await user.save();

            const friend = await User.findById(newRes?.requestFrom);
            friend.friends.push(newRes?.requestTo);
            await friend.save();
        }

        res.status(201).json({
            message: 'Friend Request ' + status,
        })

    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const profileViews = async (req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.body;

        const user = await User.findById(id);
        user.views.push(userId);
        await user.save();

        res.status(201).json({
            status: true,
            message: 'successfully'
        });
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const suggestedFriends = async (req, res, next) => {
    try {
        const userId = req.user._id;

        let queryResult = User.find(
            {_id : {$ne: userId}}, 
            {friends:{$nin: userId}}).limit(15)
            .select('firstName lastName profileUrl profession -password')

        const suggestedFriends = await queryResult;
        return res.status(200).json({
            data: suggestedFriends,
        })
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}