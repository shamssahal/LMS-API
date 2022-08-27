const { executeQuery } = require('../models/controller');

exports.updateBookStatus = async (bookId, status) => {
    const updateBookStatusQuery = `
    UPDATE books
        SET status=?
    WHERE bookId=?
`;
    try {
        await executeQuery(updateBookStatusQuery, [status, bookId]);
        return;
    } catch (err) {
        throw Error(err);
    }
};
