const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
// const { checkJwt } = require('../middleware/checkJwt');
const { body, query } = require('express-validator');
const { authByToken } = require('../middleware/auth');

router.post(
  '/',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  UserController.store
); //Store user
// router.post('/users/login',UserController.loginUser)                //Login for existing user
// router.get('/user', checkJwt, UserController.show); //Gets the currently logged-in user
// router.patch('/user',authByToken,UserController.updateUserDetails)  //Updated user information for current user

router.post(
  '/users/signin',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  UserController.signin
);

router.get(
  '/meals',
  query('page').isInt().optional({ nullable: true }),
  authByToken,
  UserController.meals
);
router.get('/dishes', authByToken, UserController.dishes);

router.get('/dishes/popular', authByToken, UserController.popular);
router.get('/dishes/menu', authByToken, UserController.menu);
router.get('/dishes/suggest', authByToken, UserController.suggest);

module.exports = router;
