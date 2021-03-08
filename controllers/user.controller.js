const User = require('../models/user.model');
const Meal = require('../models/meal.model');
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

  // console.table(req.user);
  console.log(req.params.id);

  let meals = await Meal.find(null, req.params.id);
  return res.status(200).json(meals);
};