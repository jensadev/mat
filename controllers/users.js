const { User, Meal } = require('../models/');
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

    if (bodyData.user !== 'undefined' || bodyData.user.email !== 'undefined') {
        const existingUser = await User.findOne({
            where: { email: req.body.user.email }
        });

        if (existingUser) {
            errors.errors.unshift({
                param: 'user.email',
                msg: 'user.validation.email.taken'
            });
        }
    }

    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
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
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
        return res.status(422).json({
            errors: extractedErrors
        });
    }

    passport.authenticate(
        'local',
        { session: false },
        async function (err, user) {
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

                const meals = await Meal.count({
                    where: { UserId: user.dataValues.id }
                });

                user.dataValues.meals = meals;

                res.status(200).json({ user });
            } else {
                return res.status(422).json({
                    errors: {
                        email: [req.t('error.invalid')],
                        password: [req.t('error.invalid')]
                    }
                });
            }
        }
    )(req, res, next);
};

module.exports.index = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }

    const meals = await Meal.count({
        where: { id: user.dataValues.id }
    });

    user.dataValues.meals = meals;

    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    res.status(200).json({ user });
};

module.exports.show = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
        return res.status(422).json({
            errors: extractedErrors
        });
    }

    const user = await User.findOne({
        where: { id: req.params.id, public: true }
    });
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }
    delete user.dataValues.email;
    delete user.dataValues.public;
    delete user.dataValues.family;
    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    res.status(200).json({ user });
};

module.exports.update = async (req, res) => {
    console.table(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors
            .array()
            .map((err) => (extractedErrors[err.param] = [req.t(err.msg)]));
        return res.status(422).json({
            errors: extractedErrors
        });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({
            errors: {
                user: req.t('error.notfound')
            }
        });
    }

    const email = req.body.user.email !== user.email && req.body.user.email;
    const family = req.body.user.family && req.body.user.family;
    const public = req.body.user.public && req.body.user.public;
    const bio = req.body.user.bio !== user.bio && req.body.user.bio;

    const updatedUser = await user.update({ family, public, bio, email });

    // console.log(updatedUser);

    delete updatedUser.dataValues.password;
    delete updatedUser.dataValues.createdAt;
    delete updatedUser.dataValues.updatedAt;
    res.status(200).json({ updatedUser });
};
