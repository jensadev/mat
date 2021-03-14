const User = require('../models/user.model');
const { validationResult  } = require('express-validator');

module.exports.index = async (req, res) => {
  let users = await User.find();
  return res.send(users);
};

module.exports.show = async (req, res) => {
  let userId = parseInt(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).send('Invalid object id');
  }
  
  let user = await User.find(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }
  return res.send(user);
};

module.exports.meals = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const meals = await User.meals(req.params.id);
  return res.status(200).json(meals);
};

module.exports.dishes = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const dishes = await User.dishes(typeof req.query.search != 'undefined' ? req.query.search : null , req.params.id);
  return res.status(200).json(dishes);
};

module.exports.store = async (req, res) => {

} 