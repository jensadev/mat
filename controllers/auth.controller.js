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
  // log in user
  return res.json(req.body);
};

module.exports.destroy = async (req, res) => {
  // log out user
  return res.json();
};