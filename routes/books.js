const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      res.status(500).send(error);
    }
  }
}

/* home page. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    attributes: ['id', 'title', 'author', 'genre', 'year'],
    order: [['title', 'ASC']],
  });
  res.render('index', { books, title: 'Library' });
}));

/* New book form */
router.get('/new', asyncHandler(async (req, res) => {
  res.render('books/new_book', { book: {}, title: 'New Book' });
}));

/* Post new book to database */
router.post('/', asyncHandler(async (req,res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('books/new_book', { book, errors: error.errors, title: "New Book" });
    } else {
      throw error;
    }  
  }
}));

/* Book detail form */
router.get('/:id', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/update_book', { book, title: 'Update Book' });
  } else {
    res.sendStatus(404);
  }
}));

/* Update book info in database */
router.post('/:id', asyncHandler(async (req,res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update_book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete a book */
router.get('/:id/delete', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/delete', { book, title: "Delete Book"})
  } else {
    res.sendStatus(404);
  }
}));


router.post('/:id/delete', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  } 
}));

module.exports = router;
