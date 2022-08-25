const jwt = require('jsonwebtoken');
const { executeQuery } = require('../../models/controller');
const { generateIdSerial } = require('../../utils/generateIdSerial');

const checkIfUserExists = async (email) => {
    const getUserDataQuery = `
        SELECT *
        FROM login
        WHERE email=?
    `;
    try {
        await executeQuery(getUserDataQuery, [email]);
        return { userExists: true };
    } catch (err) {
        if (err.message === 'No Data Found For Query') {
            return { userExists: false, userId: null };
        }
        throw new Error('Could not check if user exists');
    }
};

const loginCheck = async (email, password) => {
    const getLoginDataQuery = `
        SELECT *
        FROM login
        WHERE email=? AND password=?
    `;
    try {
        const data = await executeQuery(getLoginDataQuery, [email, password]);
        const { userId } = data[0];
        const output = {
            email, userId,
        };
        const signObject = {
            iss: 'app.lms.com',
            email: output.email,
            userId: output.userId,

        };
        const expiryObject = { expiresIn: '30d' };
        output.jwToken = jwt.sign(signObject, 'LMS_TokenSecret#@!', expiryObject);
        return output;
    } catch (err) {
        throw new Error('Authentication Failed');
    }
};

const signupUser = async (name, email, password, idLocation) => {
    const populateUserDataQuery = `
        INSERT INTO users
            SET userId=?,
                userName=?,
                id_loc=?
    `;
    const populateLoginDataQuery = `
        INSERT INTO login
            SET userId=?,
                email=?,
                password=?

    `;
    try {
        const { userExists } = await checkIfUserExists(email);
        if (!userExists) {
            const userId = await generateIdSerial('users', 'userId', 'USR', '0000');
            await executeQuery(populateUserDataQuery, [userId, name, idLocation]);
            await executeQuery(populateLoginDataQuery, [userId, email, password]);
            return 'User Signup Successful';
        }

        return 'User already exists';
    } catch (err) {
        throw Error(err.message);
    }
};
module.exports = {
    loginCheck,
    signupUser,
};
