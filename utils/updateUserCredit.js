const { executeQuery } = require('../models/controller');

exports.updateUserCredit = async (userId, action) => {
    const increaseCreditQuery = `
        UPDATE users
            SET available_credit=available_credit+1
        WHERE userId=?
    `;
    const decreaseCreditQuery = `
        UPDATE users
            SET available_credit=available_credit-1
        WHERE userId=?
    `;
    try {
        if (action === 'increase') {
            await executeQuery(increaseCreditQuery, [userId]);
        } else {
            await executeQuery(decreaseCreditQuery, [userId]);
        }
    } catch (err) {
        throw Error(err.message || 'Could not update user credit');
    }
};
