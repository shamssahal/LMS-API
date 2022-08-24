const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { returnObject } = require('../utils/returnObject');

const checkJWTAuthToken = (req, res, next) => {
    const jwtToken = req.headers.authorization || '';

    if (jwtToken === '') {
        res.status(401).json(returnObject(401, 'Invalid auth token', {}));
    } else {
        jwt.verify(
            _.split(jwtToken, ' ')[1],
            'LMS_TokenSecret#@!',
            (err, decodedToken) => {
                if (err) {
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
