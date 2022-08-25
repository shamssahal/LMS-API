const moment = require('moment');
const { executeQuery } = require('../../models/controller');
const { generateIdSerial } = require('../../utils/generateIdSerial');
const { getUserDetails, updateUserCredit } = require('../Users/helperMethods');

const updateBookStatus = async (bookId, status) => {
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

const getBookAllocationDetails = async (bookId) => {
    const getBookAllocationDetailsQuery = `
        SELECT 
            user_book.*,
            users.account_status
        FROM user_book
        INNER JOIN users ON user_book.userId=users.userId
        WHERE bookId=?
    `;
    try {
        const bookAllocationDetails = await executeQuery(getBookAllocationDetailsQuery, [bookId]);
        return bookAllocationDetails;
    } catch (err) {
        if (err.message === 'No Data Found For Query') {
            return [];
        }
        throw Error(err.message);
    }
};

const createNewBook = async (title, author, coverLoc) => {
    const insertBookQuery = `
        INSERT INTO books
            SET bookId=?,
                title=?,
                author=?,
                cover_loc=?,
                status='Unallocted'
    `;
    const bookId = await generateIdSerial('books', 'bookId', 'BOOK', '0000');
    try {
        await executeQuery(insertBookQuery, [bookId, title, author, coverLoc]);
        return { bookId };
    } catch (err) {
        console.log(err);
        throw new Error('Could not add book');
    }
};

const getAllBooks = async () => {
    const getAllBooksQuery = `
        SELECT *
        FROM books
        WHERE book_status='available'
    `;
    try {
        const books = await executeQuery(getAllBooksQuery, []);
        return books;
    } catch (err) {
        console.log(err);
        if (err.message === 'No Data Found For Query') {
            return [];
        }
        throw Error(err.message);
    }
};

const getBookDetails = async (bookId) => {
    const getBookDetailsQuery = `
        SELECT *
        FROM books
        WHERE bookId=? AND book_status='available'
    `;
    try {
        const book = await executeQuery(getBookDetailsQuery, [bookId]);
        const bookAllocationDetails = await getBookAllocationDetails(bookId);
        return { ...book[0], allocationHistory: bookAllocationDetails };
    } catch (err) {
        if (err.message === 'No Data Found For Query') {
            return [];
        }
        throw Error(err.message);
    }
};

const updateBookDetails = async (bookId, title, author, coverLoc) => {
    const updateBookDetailsQuery = `
        UPDATE books
        SET title=?,
            author=?,
            cover_loc=?
        WHERE bookId=?
    `;
    try {
        await executeQuery(updateBookDetailsQuery, [title, author, coverLoc, bookId]);
        return;
    } catch (err) {
        console.log(err);
        throw new Error('Could not update book details');
    }
};

const allocateBook = async (bookId, userId) => {
    const allocateBookQuery = `
        INSERT INTO user_book
            SET userId=?,
                bookId=?,
                allocatedOn=?
    `;
    try {
        const userDetails = await getUserDetails(userId);
        if (userDetails.available_credit < 1) {
            throw new Error('Not Enough Credit');
        }
        await updateBookStatus(bookId, 'Allocated');
        await executeQuery(allocateBookQuery, [userId, bookId, moment().format('YYYY-MM-DD HH:mm:ss')]);
        await updateUserCredit(userId, 'decrease');
        return;
    } catch (err) {
        throw new Error(err.message || 'Could not allocate book');
    }
};

const deallocateBook = async (bookId, userId) => {
    const deallocateBookQuery = `
        UPDATE user_book
            SET returnedOn=?
        WHERE userId=? AND bookId=?
    `;
    try {
        await updateBookStatus(bookId, 'Unallocted');
        await executeQuery(deallocateBookQuery, [moment().format('YYYY-MM-DD HH:mm:ss'), userId, bookId]);
        await updateUserCredit(userId, 'increase');
        return;
    } catch (err) {
        throw Error(err);
    }
};

const deleteBook = async (bookId) => {
    const deleteBookQuery = `
        UPDATE books
            SET book_status='discontinued'
        WHERE bookId=?
    `;
    try {
        const bookData = await getBookDetails(bookId);
        const bookDetails = bookData[0];
        if (bookData.status === 'Allocated') {
            const currentlyAllocatedTo = bookDetails.allocationHistory.filter(
                (book) => book.returnedOn === null,
            );
            await deallocateBook(bookId, currentlyAllocatedTo[0].userId);
        }
        await executeQuery(deleteBookQuery, [bookId]);
    } catch (err) {
        throw Error(err);
    }
};

module.exports = {
    createNewBook,
    getAllBooks,
    getBookDetails,
    updateBookDetails,
    allocateBook,
    deallocateBook,
    deleteBook,
};
