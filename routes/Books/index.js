const express = require('express');
const { returnObject } = require('../../utils/returnObject');
const { deleteUser } = require('../Users/helperMethods');
const {
    createNewBook, getAllBooks, getBookDetails, updateBookDetails, allocateBook, deallocateBook, deleteBook,
} = require('./helperMethods');

const router = express.Router();

router.post('/book', async (req, res) => {
    const title = req.body.title || '';
    const author = req.body.author || '';
    const coverLoc = req.body.coverLoc || '';

    if (title === '' || author === '' || coverLoc === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        const resp = await createNewBook(title, author, coverLoc);
        return res.status(200).json(returnObject(200, 'Book Added', { ...resp }));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not add book', {}));
    }
});

router.get('/books', async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(returnObject(200, 'Books Retrieved', books));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not get books', {}));
    }
});

router.get('/book', async (req, res) => {
    const bookId = req.query.bookId || '';
    if (bookId === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        const book = await getBookDetails(bookId);
        return res.status(200).json(returnObject(200, 'Book Retrieved', book));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not get book', {}));
    }
});

router.put('/book', async (req, res) => {
    const bookId = req.body.bookId || '';
    const title = req.body.title || '';
    const author = req.body.author || '';
    const coverLoc = req.body.coverLoc || '';

    if (bookId === '' || title === '' || author === '' || coverLoc === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        await updateBookDetails(bookId, title, author, coverLoc);
        return res.status(200).json(returnObject(200, 'Book Updated', {}));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not update book', {}));
    }
});

router.post('/allocate', async (req, res) => {
    const bookId = req.body.bookId || '';
    const userId = req.body.userId || '';

    if (bookId === '' || userId === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        await allocateBook(bookId, userId);
        return res.status(200).json(returnObject(200, 'Book Allocated', {}));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not allocate book', {}));
    }
});

router.put('/deallocate', async (req, res) => {
    const bookId = req.body.bookId || '';
    const userId = req.body.userId || '';

    if (bookId === '' || userId === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        await deallocateBook(bookId, userId);
        return res.status(200).json(returnObject(200, 'Book Deallocated', {}));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not deallocate book', {}));
    }
});

router.put('/deleteBook', async (req, res) => {
    const bookId = req.body.bookId || '';

    if (bookId === '') {
        return res.status(400).json(returnObject(400, 'Missing Parameters', {}));
    }
    try {
        await deleteBook(bookId);
        return res.status(200).json(returnObject(200, 'Book Deleted', {}));
    } catch (err) {
        return res.status(400).json(returnObject(400, err.message || 'Could not delete book', {}));
    }
});

module.exports = router;
