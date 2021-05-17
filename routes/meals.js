const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { authByToken } = require('../middleware/auth');

const MealsController = require('../controllers/meals');

router.get(
    '/',
    query('page')
        .isInt()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    authByToken,
    MealsController.index
);

router.get(
    '/list',
    query('size')
        .isInt()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    query('page')
        .isInt()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    authByToken,
    MealsController.list
);

router.post(
    '/',
    body('meal.dish')
        .not()
        .isEmpty()
        .isLength({ min: 4 })
        .trim()
        .escape()
        .withMessage('dish.validation.name'),
    body('meal.type').isInt().withMessage('error.invalid'),
    body('meal.date').isISO8601().withMessage('error.date'),
    authByToken,
    MealsController.store
);

router.patch(
    '/',
    body('meal.id').isInt(),
    body('meal.dish')
        .not()
        .isEmpty()
        .isLength({ min: 4 })
        .trim()
        .escape()
        .withMessage('dish.validation.name'),
    body('meal.type').isInt().withMessage('error.invalid'),
    body('meal.date').isISO8601().withMessage('error.date'),
    authByToken,
    MealsController.update
);

router.delete(
    '/:id',
    param('id').isInt().withMessage('error.invalid'),
    authByToken,
    MealsController.destroy
);

module.exports = router;
