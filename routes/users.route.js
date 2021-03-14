const express = require('express');
const router = express.Router();
// const { param, query } = require('express-validator');
const userController = require('../controllers/user.controller');
const { checkJwt } = require('../middlewares/checkJwt');

router
  .route('/meals')
  .get(
    checkJwt,
    userController.meals);

router
  .route('/dishes')
  .get(
    checkJwt,
    userController.dishes);

module.exports = router;
