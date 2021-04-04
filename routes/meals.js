const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { authByToken } = require('../middleware/auth');

const MealsController = require('../controllers/meals');

router.get(
  '/',
  query('page').isInt().optional({ nullable: true }),
  authByToken,
  MealsController.index
);

router.post(
  '/',
  body('meal.dish').not().isEmpty().trim().escape(),
  body('meal.typeId').isInt(),
  body('meal.date').isISO8601(),
  authByToken,
  MealsController.store
);

router.patch(
  '/',
  body('meal.id').isInt(),
  body('meal.dish').not().isEmpty().trim().escape(),
  body('meal.typeId').isInt(),
  body('meal.date').isISO8601(),
  authByToken,
  MealsController.update
);

router.delete(
  '/:id',
  param('id').isInt(),
  authByToken,
  MealsController.destroy
);

module.exports = router;
