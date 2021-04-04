require('dotenv').config({ path: './.env' });

const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
// const helmet = require('helmet')
const { notFound, errorHandler } = require('./middleware/errorHandler');
const usersRouter = require('./routes/users');
const mealsRouter = require('./routes/meals');
const dishesRouter = require('./routes/dishes');

const app = express();

require('./config/passport');

app.use(cors({ origin: process.env.APP_ORIGIN }));
// app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api/meals', mealsRouter);
// // app.use('/api/auth', authRouter);
// app.use('/api/dish', dishRouter);
app.use('/api/users', usersRouter);
// app.use('/', indexRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/dishes', dishesRouter);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  console.log(err.stack);

  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

// app.use(notFound);
// app.use(errorHandler);
// app.use((req, res, next) => {
//   // eslint-disable-next-line no-undef
//   next(createError(404));
// });

// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   res.locals.message = err.message;

//   res.status(err.status || 500);
//   res.send(err);
// });

module.exports = app;
