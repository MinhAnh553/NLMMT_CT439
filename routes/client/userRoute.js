import express from 'express';
import userController from '../../controllers/client/userController.js';

const Router = express.Router();

Router.route('/send-otp').post(userController.sendOTP);

Router.route('/verify-otp').post(userController.verifyOTPAndRegister);

Router.route('/login').post(userController.loginUser);

Router.route('/logout').get(userController.logoutUser);

export const userRoute = Router;
