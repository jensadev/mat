const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/auth.controller');
const registercontroller = require('../controllers/register.controller');
const { body } = require('express-validator');
const { verify } = require('../middlewares/verify');

router
  .route('/signin')
  // .get(authcontroller.create)
  .post(
    body('email').isEmail(),
    body('password').notEmpty(),
    authcontroller.store);
router
  .route('/signup')
  // .get(registercontroller.create)
  .post(
    body('email').isEmail(),
    body('password').notEmpty(),
    registercontroller.store);
router
  .route('/signout')
  .post(
    verify,
    authcontroller.destroy);
  // .post(controller.update)
  // .delete(controller.destroy);
// router
//   .route('/:id/edit')
//   .get(controller.edit);

module.exports = router;
