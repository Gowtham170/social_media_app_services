import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6, 'password length should be greater than 6 character'],
        select: false
    },
    location: { type: String },
    profileUrl: { type: String },
    profession: { type: String },
    friends: { type: Schema.Types.ObjectId, ref: 'User' },
    views: { type: String },
    // verified: { type: Boolean, default: false }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;