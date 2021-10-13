const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const { body, param } = require('express-validator');
const { authByToken } = require('../middleware/auth');

router.get('/', authByToken, UserController.index);

router.patch(
    '/',
    body('user.family')
        .isBoolean()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    body('user.public')
        .isBoolean()
        .optional({ nullable: true })
        .withMessage('error.invalid'),
    body('user.email')
        .isEmail()
        .normalizeEmail()
        .optional({ nullable: true })
        .withMessage('user.validation.email.invalid'),
    body('user.bio')
        .isLength({ min: 0, max: 255 })
        .trim()
        .escape()
        .optional({ nullable: true }),
    authByToken,
    UserController.update
);

router.get(
    '/:id',
    param('id').isInt().withMessage('error.invalid'),
    authByToken,
    UserController.show
);

router.post(
    '/',
    body('user.email')
        .isEmail()
        .normalizeEmail()
        .withMessage('user.validation.email.invalid'),
    body('user.password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
            returnScore: false
        })
        .withMessage('user.validation.password.strong'),
    body('user.passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.user.password) {
            throw new Error('user.validation.password.confirmation');
        }
        return true;
    }),
    UserController.store
);

router.post(
    '/login',
    body('user.email')
        .isEmail()
        .normalizeEmail()
        .withMessage('user.validation.email.invalid'),
    body('user.password')
        .not()
        .isEmpty()
        .withMessage('user.validation.password.required'),
    UserController.create
);

module.exports = router;
