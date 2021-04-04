const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const { body } = require('express-validator');

router.post(
  '/',
  body('user.email').isEmail().normalizeEmail(),
  body('user.password').isLength({ min: 8 }),
  body('user.passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.user.password) {
      throw new Error('Password confirmation does not match password');
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
