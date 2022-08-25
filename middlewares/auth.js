const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { returnObject } = require('../utils/returnObject');

const checkJWTAuthToken = (req, res, next) => {
    if (!req.cookies.access_token) {
        throw new Error('Authentication Failure');
    }
    const { jwToken } = req.cookies.access_token;
    if (!jwToken) {
        res.status(401).json(returnObject(401, 'Invalid auth token', {}));
    } else {
        jwt.verify(
            jwToken,
            'LMS_TokenSecret#@!',
            (err, decodedToken) => {
                if (err) {
                    console.log(err);
                    if (err.name === 'JsonWebTokenError') {
                        res.status(401).json(returnObject(401, 'Invalid auth token', {}));
                    } else if (err.name === 'TokenExpiredError') {
                        res.status(401).json(returnObject(401, 'Auth token expired', {}));
                    } else {
                        // to handle other errors
                        res.status(401).json(returnObject(401, 'Invalid auth token', {}));
                    }
                }
                req.userId = decodedToken.userId;
                return next();
            },
        );
    }
};

const auth = (req, res, next) => {
    const pathName = req.path.split('/')[1];
    if (!['login', ''].includes(pathName)) {
        return checkJWTAuthToken(req, res, next);
    }
    return next();
};

module.exports = auth;
