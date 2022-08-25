const express = require('express');
const { sha256 } = require('js-sha256');
const { returnObject } = require('../../utils/returnObject');
const { loginCheck, signupUser } = require('./helperMethods');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json(returnObject(200, 'API server is Up!', {}));
});

router.post('/login', async (req, res) => {
    const email = req.body.email || '';
    const password = req.body.password || '';
    if (email === '' || password === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        const resp = await loginCheck(email, sha256(password));
        if (process.env.NODE_ENV === 'production') {
            res.cookie('access_token', resp, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: false,
                secure: true,
            });
        } else {
            res.cookie('access_token', resp, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            });
        }

        const response = {
            userId: resp.userId,
            isAuthenticated: true,
        };
        return res.status(200).json(returnObject(200, 'Auth Successful', { ...response }));
    } catch (err) {
        return res.status(401).json(returnObject(401, err.message || 'Could not login', {}));
    }
});

router.post('/signup', async (req, res) => {
    const name = req.body.name || '';
    const email = req.body.email || '';
    const password = req.body.password || '';
    const idLocation = req.body.idLocation || '';

    console.log(name, email, password, idLocation);
    if (name === '' || email === '' || password === '' || idLocation === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        const resp = await signupUser(name, email, sha256(password), idLocation);
        return res.status(200).json(returnObject(200, resp, {}));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not signup', {}));
    }
});
module.exports = router;
