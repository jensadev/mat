const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const { body } = require('express-validator');

router.post(
  '/',
  body('user.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('user.validation.email.invalid'),
  body('user.password')
    .isStrongPassword()
    .withMessage('user.validation.password'),
  body('user.passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.user.password) {
      throw new Error('user.validation.passwordConfirmation');
    }
    return true;
  }),
  UserController.store
);

router.post(
  '/login',
  body('user.email').isEmail().normalizeEmail(),
  body('user.password').isLength({ min: 8 }),
  UserController.create
);

module.exports = router;
