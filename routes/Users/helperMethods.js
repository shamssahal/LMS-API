const { executeQuery } = require('../../models/controller');
const { deallocateBook } = require('../Books/helperMethods');

const updateUserCredit = async (userId, action) => {
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

const getUserAllocationDetails = async (userId) => {
    const getUserBookDetailsQuery = `
        SELECT 
            user_book.*,
            books.book_status
        FROM user_book
        JOIN books ON user_book.bookId = books.bookId
        WHERE userId=?
    `;
    try {
        const userBookDetails = await executeQuery(getUserBookDetailsQuery, [userId]);
        return userBookDetails;
    } catch (err) {
        if (err.message === 'No Data Found For Query') {
            return [];
        }
        throw Error(err.message);
    }
};

const getAllUsers = async () => {
    const getAllUsersQuery = `
        SELECT *
        FROM users
        WHERE account_status='active'
    `;
    try {
        const users = await executeQuery(getAllUsersQuery, []);
        return users;
    } catch (err) {
        console.log(err);
        if (err.message === 'No Data Found For Query') {
            return [];
        }
        throw Error(err.message);
    }
};

const getUserDetails = async (userId) => {
    const getUserDetailsQuery = `
        SELECT 
            users.userId,
            users.userName,
            users.id_loc,
            login.email,
            users.default_credit,
            users.available_credit
        FROM users
        JOIN login ON users.userId = login.userId
        WHERE users.userId=? AND account_status='active'
    `;
    try {
        const user = await executeQuery(getUserDetailsQuery, [userId]);
        const userAllocationDetails = await getUserAllocationDetails(userId);
        return { ...user[0], allocationHistory: userAllocationDetails };
    } catch (err) {
        if (err.message === 'No Data Found For Query') {
            return [];
        }
        throw Error(err.message);
    }
};

const updateUserDetails = async (userId, name, email, idLocation) => {
    const updateUserDetailsQuery = `
        UPDATE users JOIN login ON users.userId = login.userId
        SET userName=?,
            email=?,
            id_loc=?
        WHERE users.userId=?
    `;
    try {
        await executeQuery(updateUserDetailsQuery, [name, email, idLocation, userId]);
        return;
    } catch (err) {
        console.log(err);
        throw new Error('Could not update user details');
    }
};

const deleteUser = async (userId) => {
    const deleteUserQuery = `
        UPDATE users
        SET account_status='inactive'
        WHERE userId=?
    `;
    try {
        const userData = await getUserDetails(userId);
        const userDetails = userData[0];
        if (userDetails.available_credit < userDetails.default_credit) {
            userDetails.allocationHistory.forEach(async ({ bookId, returnedOn }) => {
                if (returnedOn === null) {
                    await deallocateBook(bookId, userId);
                }
            });
        }
        await executeQuery(deleteUserQuery, [userId]);
        return;
    } catch (err) {
        console.log(err);
        throw new Error('Could not delete user');
    }
};
module.exports = {
    getAllUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    updateUserCredit,
};
