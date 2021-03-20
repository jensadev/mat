const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const { checkJwt } = require('../middleware/checkJwt');

router.post('/users', checkJwt, UserController.store); //Store user
// router.post('/users/login',UserController.loginUser)                //Login for existing user
router.get('/user', checkJwt, UserController.show); //Gets the currently logged-in user
// router.patch('/user',authByToken,UserController.updateUserDetails)  //Updated user information for current user

module.exports = router;
