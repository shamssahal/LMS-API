const express = require('express');
const { returnObject } = require('../../utils/returnObject');
const {
    getAllUsers, getUserDetails, updateUserDetails, deleteUser,
} = require('./helperMethods');

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const data = await getAllUsers();
        return res.status(200).json(returnObject(200, 'Users Retrieved', data));
    } catch (err) {
        res.status(400).json(returnObject(400, err.message || 'Could not get users', {}));
    }
});

router.get('/user', async (req, res) => {
    const userId = req.query.userId || '';
    if (userId === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        const user = await getUserDetails(userId);
        return res.status(200).json(returnObject(200, 'User Retrieved', user));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not get user', {}));
    }
});

router.put('/user', async (req, res) => {
    const userId = req.body.userId || '';
    const name = req.body.name || '';
    const email = req.body.email || '';
    const idLocation = req.body.idLocation || '';

    if (userId === '' || name === '' || email === '' || idLocation === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        await updateUserDetails(userId, name, email, idLocation);
        return res.status(200).json(returnObject(200, 'User Details Updated', {}));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not update user details', {}));
    }
});

router.put('/deleteUser', async (req, res) => {
    const userId = req.body.userId || '';
    if (userId === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        await deleteUser(userId);
        return res.status(200).json(returnObject(200, 'User Deleted', {}));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not delete user', {}));
    }
});
module.exports = router;
