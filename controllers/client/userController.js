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

export default {
    sendOTP,
    verifyOTPAndRegister,
};
