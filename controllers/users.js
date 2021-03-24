const { Meal, User, Dish, User_Dish } = require('../models/');
const { validationResult } = require('express-validator');
const paginate = require('jw-paginate');
const { splitSub } = require('../utils/splitsub');
const { generateUserName } = require('../utils/username');
const sequelize = require('sequelize');

module.exports.meals = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array());
    }
    const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
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
          model: Dish, attributes: ['name']
        }
      ]
    });

    // if (getMeals.length == 0) {
    //   res.status(200).json({pager, pageOfItems});
    // }

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
    res.status(422).json({ errors: { body: [e.message] } });
  }
};

module.exports.dishes = async (req, res) => {
  try {
    const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
    if (!user) {
      res.status(404);
      throw new Error('User id not valid');
    }

    const getDishes = await User_Dish.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Dish, attributes: ['name']
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array());
    }
    if (!req.user.sub) throw new Error('Sub is Required');

    const [user, created] = await User.findOrCreate({
      where: { sub: splitSub(req.user.sub) },
      defaults: {
        nickname: generateUserName(),
        email: req.body.email
      }
    });

    if (user) {
      res.status(201).json({ user });
    }
  } catch (e) {
    res
      .status(422)
      .json({ errors: { body: ['Could not create user ', e.message] } });
  }
};

// module.exports.show = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.sub);
//     if (!user) {
//       throw new Error('No such user found');
//     }
//     return res.status(200).json({ user });
//   } catch (e) {
//     return res.status(404).json({
//       errors: { body: [e.message] }
//     });
//   }
// };

module.exports.popular = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   throw new Error(errors.array());
    // }
    const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
    if (!user) {
      res.status(404);
      throw new Error('User id not valid');
    }

    const getDishes = await Meal.findAll({
      attributes: [[sequelize.fn('count', sequelize.col('dishId')), 'count']],
      group: ['dishId'],
      where: { userId: user.id },
      include: [
        {
          model: Dish, attributes: ['name']
        }
      ],
      order: [
        [sequelize.literal('count'), 'DESC']
      ],
      limit: 10
    });

    // if (getMeals.length == 0) {
    //   res.status(200).json({pager, pageOfItems});
    // }

    const dishes = [];
    if (getDishes) {
      for (let dish of getDishes) {
        dishes.push(dish.dataValues);
      }
    }

    res.status(200).json({ dishes });
  } catch (e) {
    res.status(422).json({ errors: { body: [e.message] } });
  }
};
