import bcrypt from 'bcrypt';

import userModel from '../../models/userModel.js';
import otpModel from '../../models/otpModel.js';
import emailProvider from '../../providers/emailProvider.js';
import otpTemplate from '../../templates/otpTemplate.js';

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const sendOTP = async (email) => {
    const existingUser = await userModel.findOne({
        email,
        deleted: false,
    });
    if (existingUser) {
        throw new Error(
            'Email này đã được đăng ký. Vui lòng sử dụng email khác.',
        );
    }

    const existingOtp = await otpModel.findOne({
        email,
        expiresAt: { $gt: new Date() },
    });

    if (existingOtp) {
        throw new Error(
            'Mã xác minh đã được gửi. Vui lòng kiểm tra email và nhập mã trước khi yêu cầu lại.',
        );
    }

    await otpModel.deleteMany({ email });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP hết hạn sau 5 phút

    const otpRecord = new otpModel({
        email,
        otp,
        expiresAt,
    });
    await otpRecord.save();

    await emailProvider.sendMail(
        email,
        'Melody Meet - Mã Xác Minh',
        otpTemplate(otp),
    );

    return { message: 'Mã xác minh đã được gửi đến email của bạn' };
};

const verifyOTPAndRegister = async (email, otp, password) => {
    const otpRecord = await otpModel.findOne({ email, otp });
    if (!otpRecord) throw new Error('Mã xác minh không đúng hoặc đã hết hạn');

    if (otpRecord.expiresAt < new Date()) {
        await otpModel.deleteMany({ email });
        throw new Error('Mã xác minh đã hết hạn');
    }

    await otpModel.deleteMany({ email });

    // Băm mật khẩu và tạo tài khoản
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ email, password: hashedPassword });
    await user.save();

    return { message: 'Đăng ký thành công!' };
};

const login = async (email, password) => {
    const user = await userModel.findOne({
        email,
        deleted: false,
    });

    if (!user) throw new Error('Email không tồn tại');

    if (user.status == 'inactive') throw new Error('Tài khoản đã bị khóa!');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mật khẩu không đúng');

    // Vượt qua tất cả case thì trả về thông tin user
    return user;
};

export default {
    sendOTP,
    verifyOTPAndRegister,
    login,
};
