const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { authByToken } = require('../middleware/auth');

const DishesController = require('../controllers/dishes');

router.patch(
  '/',
  body('dish.id').isInt(),
  body('dish.name').not().isEmpty().trim().escape(),
  authByToken,
  DishesController.update
);

router.delete(
  '/:id',
  param('id').isInt(),
  authByToken,
  DishesController.destroy
);

module.exports = router;
