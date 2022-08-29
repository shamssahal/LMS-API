// importing required modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const responseTime = require('response-time');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const logger = require('./utils/Logger');
const auth = require('./middlewares/auth');

// Limiting api rate to 1000 hits / 5 mins
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000,
});

// initating express app
const app = express();

// importing routes
const login = require('./routes/Login');
const books = require('./routes/Books');
const users = require('./routes/Users');

const whitelist = ['http://localhost:3000', 'https://lms.sahal.dev'];
const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        if (whitelist.includes(origin)) { return callback(null, true); }

        callback(new Error('Not allowed by CORS'));
    },
};

app.use(cors(corsOptions));

// Logging incoming request on console on development and sourcing out on production
app.use(
    responseTime((req, res, time) => {
        if (req.method === 'OPTIONS') return null;
        const logObj = {
            userId: req.userId || 'NEW_USER',
            params: ['GET', 'DELETE'].includes(req.method)
                ? JSON.stringify(req.query)
                : JSON.stringify(req.body),
            status: res.statusCode,
            time_taken: `${parseFloat(time.toFixed(2))} ms`,
            endpoint: req.path,
            method: req.method,
        };
        if (logObj.status >= 400) {
            logger.error({ level: 0, message: { ...logObj } });
        } else if (logObj.status >= 300 && logObj.status < 400) {
            logger.warn({ level: 2, message: { ...logObj } });
        } else {
            logger.info({ level: 2, message: { ...logObj } });
        }
        return logObj;
    }),
);

// applying middleware
app.use(helmet());
app.enable('trust proxy');
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser());
app.use(compression());

// applying auth layer
app.use(auth);

// using routes
app.use('/', login);
app.use('/', books);
app.use('/', users);

// error handling in case server goes down
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        responseStatus: {
            statusCode: 500,
            message: 'An error occured please try again',
            errorTypeCode: 0,
        },
        responseData: null,
    });

    return next;
});

// starting server
app.listen(3000, () => {
    console.log('server is up on 3000');
});
