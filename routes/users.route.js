const express = require('express');
const router = express.Router();
const { param, query } = require('express-validator');
const userController = require('../controllers/user.controller');
const { checkJwt } = require('../middlewares/checkJwt');

router
  .route('/:id/meals')
  .get(
    param('id').isInt(),
    checkJwt,
    userController.meals);

router
  .route('/:id/dishes')
  .get(
    param('id').isInt(),
    query('search').trim().escape().optional({nullable: true}),
    checkJwt,
    userController.dishes);

module.exports = router;
