const express = require('express');
const router = express.Router();
const { param, query } = require('express-validator');
const userController = require('../controllers/user.controller');
const { verify } = require('../middlewares/verify');

router
  .route('/:id/meals')
  .get(
    param('id').isInt(),
    verify,
    userController.meals);

router
  .route('/:id/dishes')
  .get(
    param('id').isInt(),
    query('search').trim().escape().optional({nullable: true}),
    verify,
    userController.dishes);

module.exports = router;
