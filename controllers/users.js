const { Meal, User, Dish, User_Dish } = require('../models/');
const { validationResult } = require('express-validator');
const paginate = require('jw-paginate');
const { generateUserName } = require('../utils/username');
// const sequelize = require('sequelize');
const { hashPassword, matchPassword } = require('../utils/password');
const { sign } = require('../utils/jwt');

module.exports.meals = async (req, res) => {
  try {
    validationResult(req).throw();

    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User id not valid');
    }

    const getMeals = await Meal.findAll({
      attributes: ['id', 'date', 'typeId'],
      where: { userId: user.id },
      order: [
        ['date', 'DESC'],
        ['typeId', 'DESC']
      ],
      include: [
        {
          model: Dish,
          attributes: ['name']
        }
      ]
    });

    const meals = [];
    if (getMeals) {
      for (let meal of getMeals) {
        meals.push(meal.dataValues);
      }
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = 7;
    const pager = paginate(meals.length, page, pageSize);
    const pageOfItems = meals.slice(pager.startIndex, pager.endIndex + 1);

    res.status(200).json({ pager, pageOfItems });
  } catch (e) {
    res.status(422).json({ errors: { body: [e.message || e.mapped()] } });
  }
};

module.exports.dishes = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User id not valid');
    }

    const getDishes = await User_Dish.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Dish,
          attributes: ['name']
        }
      ]
    });

    const dishes = [];
    if (getDishes)
      for (let dish of getDishes) {
        dishes.push(dish.dataValues.Dish);
      }
    res.status(200).json({ dishes });
  } catch (e) {
    res.status(422).json({ errors: { body: [e.message] } });
  }
};

module.exports.store = async (req, res) => {
  try {
    validationResult(req).throw();

    const existingUser = await User.findOne({
      where: { email: req.body.email }
    });

    if (existingUser) {
      throw new Error('User aldready exists');
    }

    const password = await hashPassword(req.body.password);

    const user = await User.create({
      handle: generateUserName(),
      password: password,
      email: req.body.email
    });

    if (user) {
      if (user.dataValues.password) delete user.dataValues.password;
      user.dataValues.token = await sign(user);
      res.status(201).json({ user });
    }
  } catch (e) {
    res.status(422).json({
      errors: { body: ['Could not create user ', e.message || e.mapped()] }
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    validationResult(req).throw();

    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res.status(401);
      throw new Error('No User found');
    }

    //Check if password matches
    const passwordMatch = await matchPassword(user.password, req.body.password);

    if (!passwordMatch) {
      res.status(401);
      throw new Error('Invalid password or email');
    }

    delete user.dataValues.password;
    user.dataValues.token = await sign({
      id: user.dataValues.id,
      email: user.dataValues.email,
      handle: user.dataValues.handle
    });

    res.status(200).json({ user });
  } catch (e) {
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status).json({
      errors: { body: ['Could not login user ', e.message || e.mapped()] }
    });
  }
};

// module.exports.popular = async (req, res) => {
//   try {
//     // const errors = validationResult(req);
//     // if (!errors.isEmpty()) {
//     //   throw new Error(errors.array());
//     // }
//     const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
//     if (!user) {
//       res.status(404);
//       throw new Error('User id not valid');
//     }

//     const getDishes = await Meal.findAll({
//       attributes: [[sequelize.fn('count', sequelize.col('dishId')), 'count']],
//       group: ['dishId'],
//       where: { userId: user.id },
//       include: [
//         {
//           model: Dish,
//           attributes: ['name']
//         }
//       ],
//       order: [[sequelize.literal('count'), 'DESC']],
//       limit: 10
//     });

//     // if (getMeals.length == 0) {
//     //   res.status(200).json({pager, pageOfItems});
//     // }

//     const dishes = [];
//     if (getDishes) {
//       for (let dish of getDishes) {
//         dishes.push(dish.dataValues);
//       }
//     }

//     res.status(200).json({ dishes });
//   } catch (e) {
//     res.status(422).json({ errors: { body: [e.message] } });
//   }
// };

// module.exports.menu = async (req, res) => {
//   try {
//     // const errors = validationResult(req);
//     // if (!errors.isEmpty()) {
//     //   throw new Error(errors.array());
//     // }
//     const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
//     if (!user) {
//       res.status(404);
//       throw new Error('User id not valid');
//     }

//     const getDishes = await User_Dish.findAll({
//       attributes: [],
//       where: { userId: user.id },
//       include: [
//         {
//           model: Dish,
//           attributes: ['name']
//         }
//       ],
//       order: [[sequelize.literal('rand()'), 'DESC']],
//       // order: [sequelize.fn('rand'), 'dishId'],
//       limit: 7
//     });

//     // if (getMeals.length == 0) {
//     //   res.status(200).json({pager, pageOfItems});
//     // }

//     const dishes = [];
//     if (getDishes) {
//       for (let dish of getDishes) {
//         dishes.push(dish.dataValues);
//       }
//     }

//     res.status(200).json({ dishes });
//   } catch (e) {
//     res.status(422).json({ errors: { body: [e.message] } });
//   }
// };

// module.exports.suggest = async (req, res) => {
//   try {
//     // const errors = validationResult(req);
//     // if (!errors.isEmpty()) {
//     //   throw new Error(errors.array());
//     // }
//     const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
//     if (!user) {
//       res.status(404);
//       throw new Error('User id not valid');
//     }

//     const getDish = await User_Dish.findOne({
//       attributes: [],
//       where: { userId: user.id },
//       include: [
//         {
//           model: Dish,
//           attributes: ['name']
//         }
//       ],
//       order: [[sequelize.literal('rand()'), 'DESC']],
//       // order: [sequelize.fn('rand'), 'dishId'],
//       limit: 7
//     });

//     const dish = getDish.dataValues.Dish;

//     res.status(200).json({ dish });
//   } catch (e) {
//     res.status(422).json({ errors: { body: [e.message] } });
//   }
// };
