import { FriendRequest, User } from "../model/index.js";

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate({
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

export const friendRequest = async (req, res, next) => {
    try {
        const userId = req.user.userId;
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

export const getfriendRequest = async (req, res) => {
    try {
        const userId = req.user.userId;

        const request  = await FriendRequest.find({
            requestTo: userId,
            requestStatus: 'Pending'
        }).populate({
            path: 'requestFrom',
            select: 'firstName lastName profileUrl profession -password'
        })
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        
    } catch (error) {
        return res.status(404).json(`Error: ${error.message}`);
    }
}