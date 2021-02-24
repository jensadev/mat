const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/auth.controller');
const registercontroller = require('../controllers/register.controller');
const { body, validationResult  } = require('express-validator');

router
  .route('/login')
  .get(authcontroller.create)
  .post(authcontroller.store);
router
  .route('/register')
  .get(registercontroller.create)
  .post(
    body('email').isEmail(),
    body('password').notEmpty(),
    registercontroller.store);
router
  .route('/logout')
  .post(authcontroller.destroy);
  // .post(controller.update)
  // .delete(controller.destroy);
// router
//   .route('/:id/edit')
//   .get(controller.edit);

module.exports = router;
