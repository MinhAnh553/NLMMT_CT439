import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        isAdmin: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            default: 'active',
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);

const userModel = mongoose.model('User', userSchema, 'users');

export default userModel;
