import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: Date,
});

const otpModel = mongoose.model('Otp', otpSchema, 'otp');

export default otpModel;
