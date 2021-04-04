const { User } = require('../models/');
const { validationResult } = require('express-validator');
const { generateUserName } = require('../utils/username');
const { hashPassword, matchPassword } = require('../utils/password');
const { sign } = require('../utils/jwt');
const passport = require('passport');
const { errorFormatter } = require('../utils/error-formatter');
// const validator = require('validator');

module.exports.store = async (req, res) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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
      delete user.dataValues.password;
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

module.exports.create = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  passport.authenticate(
    'local',
    { session: false },
    async function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (user) {
        delete user.dataValues.password;
        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;
        const token = await sign({
          id: user.dataValues.id,
          email: user.dataValues.email,
          handle: user.dataValues.handle
        });

        user.dataValues.token = token;
        // user.token = user.generateJWT();
        // return res.json({ user: user.toAuthJSON() });
        res.status(200).json({ user });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
};
