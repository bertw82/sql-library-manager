const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books?page=1')
});

// router.get('/books', (req, res, next) => {
//   res.redirect('/books?page=1');
// });

module.exports = router;
