import userService from '../../services/client/userService.js';

// [POST] /user/send-otp
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await userService.sendOTP(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [POST] /user/verify-otp
const verifyOTPAndRegister = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const response = await userService.verifyOTPAndRegister(
            email,
            otp,
            password,
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// [POST] /user/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.login(email, password);
        req.session.user = user;

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [POST] /user/logout
const logoutUser = async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

export default {
    sendOTP,
    verifyOTPAndRegister,
    loginUser,
    logoutUser,
};
