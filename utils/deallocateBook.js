const moment = require('moment');
const { executeQuery } = require('../models/controller');
const { updateUserCredit } = require('./updateUserCredit');
const { updateBookStatus } = require('./updateBookStatus');

exports.deallocateBook = async (bookId, userId) => {
    const deallocateBookQuery = `
        UPDATE user_book
            SET returnedOn=?
        WHERE userId=? AND bookId=?
    `;
    try {
        await updateBookStatus(bookId, 'Unallocated');
        await executeQuery(deallocateBookQuery, [moment().format('YYYY-MM-DD HH:mm:ss'), userId, bookId]);
        await updateUserCredit(userId, 'increase');
        return;
    } catch (err) {
        throw Error(err);
    }
};
