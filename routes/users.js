const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const { checkJwt } = require('../middleware/checkJwt');
const { body, query } = require('express-validator');

router.post('/', body('email').isEmail(), checkJwt, UserController.store); //Store user
// router.post('/users/login',UserController.loginUser)                //Login for existing user
// router.get('/user', checkJwt, UserController.show); //Gets the currently logged-in user
// router.patch('/user',authByToken,UserController.updateUserDetails)  //Updated user information for current user

router.get(
  '/meals',
  query('page').isInt().optional({ nullable: true }),
  checkJwt,
  UserController.meals
);
router.get('/dishes', checkJwt, UserController.dishes);

router.get('/dishes/popular', checkJwt, UserController.popular);
router.get('/dishes/menu', checkJwt, UserController.menu);
router.get('/dishes/suggest', checkJwt, UserController.suggest);

module.exports = router;
