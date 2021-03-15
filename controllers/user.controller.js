const User = require('../models/user.model');
// const { validationResult  } = require('express-validator');

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
  const sub = User.getSub(req.user.sub);

  try {
    let user = await User.find('sub', sub);

    if(!user) {
      user = new User(null, sub);
      user = await user.save();
    }

    const meals = await User.meals(user.id);
    return res.status(200).json(meals);

  } catch (err) {
    console.error(err);
    return res.status(500);
  }
};

module.exports.dishes = async (req, res) => {
  const sub = User.getSub(req.user.sub);
  try {
    let user = await User.find('sub', sub);

    if(!user) {
      user = new User(null, sub);
      user = await user.save();
    }

    const dishes = await User.dishes(null, user.id);
    return res.status(200).json(dishes);

  } catch (err) {
    console.error(err);
    return res.status(500);
  }
  // const dishes = await User.dishes(typeof req.query.search != 'undefined' ? req.query.search : null , req.params.id);
  // return res.status(200).json(dishes);
};
