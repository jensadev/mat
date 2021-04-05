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
// const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
//   // Build your resulting errors however you want! String, object, whatever - it works!
//   return `${location}[${param}]: ${msg}`;
// };

module.exports.store = async (req, res) => {
  const errors = validationResult(req);
  const bodyData = matchedData(req, { params: ['user.email'] });

  if (bodyData.user != 'undefined' || bodyData.user.email != 'undefined') {
    const existingUser = await User.findOne({
      where: { email: req.body.user.email }
    });

    if (existingUser) {
      errors.errors.unshift({
        param: req.t('user.email'),
        msg: req.t('user.validation.email.taken')
      });
    }
  }

  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors
      .array()
      .map((err) => (extractedErrors[req.t(err.param)] = [req.t(err.msg)]));
    return res.status(422).json({
      'req.language': req.language,
      'req.i18n.language': req.i18n.language,
      'req.i18n.languages': req.i18n.languages,
      'req.i18n.languages[0]': req.i18n.languages[0],
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
