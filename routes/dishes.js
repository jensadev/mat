const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { authByToken } = require('../middleware/auth');

const DishesController = require('../controllers/dishes');

router.get('/', authByToken, DishesController.index);

router.get('/top', authByToken, DishesController.top);
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
