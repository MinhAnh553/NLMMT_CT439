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
            'OTP đã được gửi. Vui lòng kiểm tra email và nhập mã trước khi yêu cầu lại.',
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

    await emailProvider.sendMail(email, 'Mã Xác Minh OTP', otpTemplate(otp));

    return { message: 'OTP đã được gửi đến email của bạn' };
};

const verifyOTPAndRegister = async (email, otp, password) => {
    const otpRecord = await otpModel.findOne({ email, otp });
    if (!otpRecord) throw new Error('OTP không đúng hoặc đã hết hạn');

    if (otpRecord.expiresAt < new Date()) {
        await otpModel.deleteMany({ email });
        throw new Error('OTP đã hết hạn');
    }

    await otpModel.deleteMany({ email });

    // Băm mật khẩu và tạo tài khoản
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ email, password: hashedPassword });
    await user.save();

    return { message: 'Đăng ký thành công!' };
};

export default {
    sendOTP,
    verifyOTPAndRegister,
};
