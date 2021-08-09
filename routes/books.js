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

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    attributes: ['id', 'title', 'author', 'genre', 'year'],
    order: [['title', 'ASC']],
  });
  res.render('index', { books, title: 'Library' });
}));

/* GET new book form */
router.get('/books/new', (req, res) => {

});

/* POST new book to database */
router.post('/books/new', asyncHandler(async (req,res) => {

}));

/* GET book detail form */
router.get('/books/:id', asyncHandler(async (req,res) => {

}));

/* POST update book info in database */
router.post('/books/:id', asyncHandler(async (req,res) => {

}));

/* POST delete a book */
router.post('/books/:id/delete', asyncHandler(async (req,res) => {

}));

module.exports = router;
