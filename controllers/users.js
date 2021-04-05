const { User } = require('../models/');
const { validationResult, matchedData } = require('express-validator');
const { generateUserName } = require('../utils/username');
const { hashPassword } = require('../utils/password');
const { sign } = require('../utils/jwt');
const passport = require('passport');

// {
//   "errors": {
//       "email": [
//           "has already been taken"
//       ],
//       "password": [
//           "is too short (minimum is 8 characters)"
//       ],
//       "username": [
//           "can't be blank",
//           "is too short (minimum is 1 character)",
//           "is too long (maximum is 20 characters)"
//       ]
//   }
// }
module.exports.store = async (req, res) => {
  const errors = validationResult(req);
  const bodyData = matchedData(req, { params: ['user.email'] });

  if (bodyData.user.email) {
    const existingUser = await User.findOne({
      where: { email: req.body.user.email }
    });

    if (existingUser) {
      errors.errors.unshift({
        param: 'user.email',
        msg: 'has already been taken'
      });
    }
  }

  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors
      .array()
      .map(
        (err) => (extractedErrors[err.param.replace('user.', '')] = [err.msg])
      );
    return res.status(422).json({
      errors: extractedErrors
    });
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
};

module.exports.create = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: { 'email or password': 'is invalid' }
    });
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
