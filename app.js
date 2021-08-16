const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const models = require('./models');

const books = require('./routes/books');
const routes = require('./routes/index');
const { create } = require('domain');

const app = express();

(async () => {
    await models.sequelize.sync();
    try {
      await models.sequelize.authenticate();
      console.log('Connection to the database successful');
    } catch (error) {
        console.log('Error connecting to the database', error);
    }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.message = 'Page Not Found';
  err.status = 404;
  console.log(`Error ${err.status}: ${err.message}`);
  res.render('books/page-not-found', { err });
  next();
});

// error handler
app.use((err, req, res, next) => {
  res.locals.error = err;
  if (err.status === undefined) {
      err.status = 500;
      err.message = 'Server Error';
      console.log(`Error ${err.status}: ${err.message}`);
      res.render('error', { err });
  } else {
    res.status(err.status || 500);
    console.log(`Error ${err.status}: ${err.message}`);
    res.render('error', { err });
  }
});

module.exports = app;
