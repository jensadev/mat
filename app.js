const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')

require('dotenv').config({path: './.env'});

const indexRouter = require('./routes/index.route');
const mealsRouter = require('./routes/meals.route');
const authRouter = require('./routes/auth.route');
const dishRouter = require('./routes/dish.route');
const usersRouter = require('./routes/users.route');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/meals', mealsRouter);
app.use('/api/auth', authRouter);
app.use('/api/dish', dishRouter);
app.use('/api/users', usersRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
  // eslint-disable-next-line no-undef
  next(createError(404));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.message = err.message;

  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
