const { User } = require('../models/');
const { validationResult } = require('express-validator');
const { generateUserName } = require('../utils/username');
const { hashPassword, matchPassword } = require('../utils/password');
const { sign } = require('../utils/jwt');

module.exports.store = async (req, res) => {
  try {
    validationResult(req).throw();

    const existingUser = await User.findOne({
      where: { email: req.body.user.email }
    });

    if (existingUser) {
      throw new Error('User aldready exists');
    }

    const password = await hashPassword(req.body.user.password);

    const user = await User.create({
      handle: generateUserName(),
      password: password,
      email: req.body.user.email
    });

    if (user) {
      if (user.dataValues.password) delete user.dataValues.password;
      delete user.dataValues.createdAt;
      delete user.dataValues.updatedAt;
      user.dataValues.token = await sign(user);
      res.status(201).json({ user });
    }
  } catch (e) {
    res.status(422).json({
      errors: { body: ['Could not create user ', e.message || e.mapped()] }
    });
  }
};

module.exports.create = async (req, res) => {
  console.table(req.body);
  try {
    validationResult(req).throw();

    const user = await User.findOne({ where: { email: req.body.user.email } });

    if (!user) {
      res.status(401);
      throw new Error('No User found');
    }

    //Check if password matches
    const passwordMatch = await matchPassword(
      user.password,
      req.body.user.password
    );

    if (!passwordMatch) {
      res.status(401);
      throw new Error('Invalid password or email');
    }

    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    const token = await sign({
      id: user.dataValues.id,
      email: user.dataValues.email,
      handle: user.dataValues.handle
    });

    user.dataValues.token = token;

    res.status(200).json({ user });
  } catch (e) {
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status).json({
      errors: { body: ['Could not login user ', e.message || e.mapped()] }
    });
  }
};
