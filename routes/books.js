const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

/* home page. */
router.get('/', asyncHandler(async (req, res) => {
  let limit = 6;
  const page = Number.parseInt(req.query.page);
  const books = await Book.findAndCountAll({
    attributes: ['id', 'title', 'author', 'genre', 'year'],
    order: [['title', 'ASC']],
    limit,
    offset: (page -1) * limit
  });
  res.render('index', {
    title: 'Library',
    books: books.rows,
    pages: Math.ceil(books.count / limit)
  });
}));

/* New book form */
router.get('/new', asyncHandler(async (req, res) => {
  res.render('books/new-book', { book: {}, title: 'New Book' });
}));

/* Post new book to database */
router.post('/new', asyncHandler(async (req,res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('books/new-book', { book, errors: error.errors, title: "New Book" });
    } else {
      throw error;
    }
  }
}));

/* Book detail form */
router.get('/:id', asyncHandler(async (req,res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/update-book', { book, title: 'Update Book' });
  } else {
    next();
  }
}));

/* Update book info in database */
router.post('/:id', asyncHandler(async (req,res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      next();
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.log(error)
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete a book */
router.get('/:id/delete', asyncHandler(async (req,res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/delete', { book, title: "Delete Book"})
  } else {
    next();
  }
}));

router.post('/:id/delete', asyncHandler(async (req,res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    next();
  } 
}));

module.exports = router;
