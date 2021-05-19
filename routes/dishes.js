const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { authByToken } = require('../middleware/auth');

const DishesController = require('../controllers/dishes');

router.get(
    '/',
    query('size')
        .isInt()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    query('page')
        .isInt()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    authByToken,
    DishesController.index
);

router.get('/all', authByToken, DishesController.all);

router.get(
    '/top',
    query('limit')
        .isInt()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    authByToken,
    DishesController.top
);
router.get('/menu', authByToken, DishesController.menu);
router.get('/suggest', authByToken, DishesController.suggest);

router.patch(
    '/',
    body('dish.id').isInt().withMessage('error.invalid'),
    body('dish.name')
        .not()
        .isEmpty()
        .isLength({ min: 4 })
        .trim()
        .escape()
        .withMessage('dish.validation.name'),
    authByToken,
    DishesController.update
);

router.delete(
    '/:id',
    param('id').isInt().withMessage('error.invalid'),
    authByToken,
    DishesController.destroy
);

module.exports = router;
