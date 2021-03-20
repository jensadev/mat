require('dotenv').config({ path: './.env' });

const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
// const helmet = require('helmet')
const { notFound, errorHandler } = require('./middleware/errorHandler');
const sequelize = require('./dbConnection');

// const User = require('./models/user');
// const Meal = require('./models/meal');
// const Dish = require('./models/dish');
// const Mealtype = require('./models/mealtype');

// const sync = async () => await sequelize.sync({ alter: true });
// sync();

// const indexRouter = require('./routes/index.route');
// const mealsRouter = require('./routes/meals.route');
// const dishRouter = require('./routes/dish.route');
// const usersRouter = require('./routes/users.route');
const mealsRouter = require('./routes/meals');

const app = express();

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
// app.use('/api/users', usersRouter);
// app.use('/', indexRouter);
app.use('/api/meals', mealsRouter);
app.use(notFound);
app.use(errorHandler);
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
