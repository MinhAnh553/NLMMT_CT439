import express from 'express';
import { homeRoute } from './homeRoute.js';
import { userRoute } from './userRoute.js';
import { eventRoute } from './eventRoute.js';
import authMiddleware from '../../middlewares/client/authMiddleware.js';

const Router = express.Router();

Router.use(authMiddleware.infoUser);

Router.use('/', homeRoute);

Router.use('/user', userRoute);

Router.use('/event', authMiddleware.isAuthorized, eventRoute);

export const clientRoute = Router;
