import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';

import * as database from './config/database.js';
import { clientRoute } from './routes/client/indexRoute.js';
import system from './config/system.js';

// env
dotenv.config();

// App, port
const app = express();
const port = process.env.PORT;

// Session database
const MongoDBStoreSession = MongoDBStore(session);

const store = new MongoDBStoreSession({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
});

app.use(
    session({
        secret: 'day-la-nien-luan-cua-minh-anh',
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: { maxAge: 1000 * 60 * 60 },
    }),
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Config view
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

// Config static file
app.use(express.static(path.join(process.cwd(), 'public')));

// Database
database.connect();

// Biến
app.locals.prefixAdmin = system.prefixAdmin;

/* New Route to the TinyMCE Node module */
app.use(
    '/tinymce',
    express.static(
        path.join(path.join(process.cwd()), 'node_modules', 'tinymce'),
    ),
);

// Route
app.use(clientRoute);

app.listen(port, () => {
    console.log(`Project back-end running at http://localhost:${port}...`);
});
