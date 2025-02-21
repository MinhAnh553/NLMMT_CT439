import express from 'express';
import eventController from '../../controllers/client/eventController.js';
import uploadCloudProvider from '../../providers/uploadCloudProvider.js';

const Router = express.Router();

Router.route('/create')
    .get(eventController.showCreateForm)
    .post(
        uploadCloudProvider.fields([
            { name: 'eventLogo', maxCount: 1 },
            { name: 'eventBackground', maxCount: 1 },
            { name: 'organizerLogo', maxCount: 1 },
        ]),
        eventController.createEvent,
    );

export const eventRoute = Router;
