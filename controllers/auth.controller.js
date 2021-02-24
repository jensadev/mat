const User = require('../models/user.model');
const { body, validationResult  } = require('express-validator');
const bcrypt = require('bcrypt');

module.exports.create = async (req, res) => {
  // loginform
  return res.status(200).json({
    email: 'email',
    password: 'password'
  });
};

module.exports.store = async (req, res) => {
  let user = await User.find('email', req.body.email);
  if (!user) {
    return res.status(404).json( { error: 'User not found' } );
  } else {
    bcrypt.compare(req.body.password, user.password, (err, match) => {
      if (err) {
        return res.status(500).json(err);
      } else if (match) {
        return res.status(200).json( { token: user.generateToken() } );
      } else {
        return res.status(403).json( { error: 'Passwords do not match.' } );
      }
    });
  }
};

module.exports.destroy = async (req, res) => {
  // log out user
  return res.json();
};