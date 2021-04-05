const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const { body } = require('express-validator');

router.post(
  '/',
  body('user.email').isEmail().normalizeEmail(),
  body('user.password')
    .isStrongPassword()
    .withMessage(
      'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'
    ),
  body('user.passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.user.password) {
      throw new Error('Passwords do not match');
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
