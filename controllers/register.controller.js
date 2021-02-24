const User = require('../models/user.model');
const { body, validationResult  } = require('express-validator');
const bcrypt = require('bcrypt');

module.exports.create = async (req, res) => {
  // register user form
  return res.status(200).json({
    email: 'email',
    password: 'password'
  });
};

module.exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) res.status(500).json(err);
    const newUser = new User(req.body.email, hash);
    const result = await newUser.save();
    if (result > 0) {
      return res.send(newUser);  
    } else {
      return res.status(400).json({ errors: 'Invalid request' });
    }
  });
};

module.exports.destroy = async (req, res) => {
  // log out user
  return res.json();
};