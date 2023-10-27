import mongoose, { Schema } from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    requestTo: { type: Schema.Types.ObjectId, ref: 'User' },
    requestFrom: { type: Schema.Types.ObjectId, ref: 'User' },
    requestStatus: { type: String, default: 'Pending' }
}, { timestamps: true });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequest;