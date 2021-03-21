const { Meal, User, Dish, Mealtype, User_Dish } = require('../models/');

const adjektiv = require('../docs/adjektiv.json');
const substantiv = require('../docs/substantiv.json');
const paginate = require('jw-paginate');
const validator = require('express-validator');

module.exports.meals = async (req, res) => {
  try {
    const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
    // const user = await User.findOne({ where: { id: 1 } });
    if (!user) {
      res.status(404);
      throw new Error('User id not valid');
    }

    const getMeals = await Meal.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Dish
          // where: { name: 'Dish name'}
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
    const pageSize = 10;
    const pager = paginate(meals.length, page, pageSize);
    const pageOfItems = meals.slice(pager.startIndex, pager.endIndex + 1);

    res.status(200).json({pager, pageOfItems});
  } catch (e) {
    res.status(422).json({ errors: { body: [e.message] } });
  }
};

module.exports.dishes = async (req, res) => {
  const dishes = [
    {id: 1, name: 'Mat'},
    {id: 2, name: 'Fläsk'}
  ]
  res.status(200).json({ dishes });
  // try {
  //   const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });
  //   // const user = await User.findOne({ where: { id: 1 } });
  //   if (!user) {
  //     res.status(404);
  //     throw new Error('User id not valid');
  //   }

  //   const getDishes = await User_Dish.findAll({
  //     where: { userId: user.id },
  //     include: [
  //       {
  //         model: Dish
  //         // where: { name: 'Dish name'}
  //       }
  //     ]
  //   });

  //   const dishes = [];
  //   if (getDishes)
  //     for (let dish of getDishes) {
  //       dishes.push(dish.dataValues.Dish);
  //     }
  //   res.status(200).json({ dishes });
  // } catch (e) {
  //   res.status(422).json({ errors: { body: [e.message] } });
  // }
};

module.exports.store = async (req, res) => {
  try {
    if (!req.user.sub) throw new Error('Sub is Required');
    if (!req.body.email) throw new Error('Email is Required');
    if (!validator.isEmail(req.body.email))
      throw new Error('Email is Required');
    // console.table(req.user);
    // console.table(req.body.email);

    const [user, created] = await User.findOrCreate({
      where: { sub: splitSub(req.user.sub) },
      defaults: {
        nickname: generateUserName(),
        email: req.body.email
      }
    });
    // const existingUser = await User.findOne({
    //   where: { sub: splitSub(req.user.sub) }
    // });
    // if (existingUser) throw new Error('User aldready exists with this sub id');

    // const user = await User.create({
    //   sub: splitSub(req.user.sub),
    //   nickname: generateUserName(),
    //   email: req.user.email
    // });

    if (user) {
      res.status(201).json({ user });
    }
  } catch (e) {
    res
      .status(422)
      .json({ errors: { body: ['Could not create user ', e.message] } });
  }
};

module.exports.show = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) {
      throw new Error('No such user found');
    }
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(404).json({
      errors: { body: [e.message] }
    });
  }
};

function splitSub(sub) {
  if (sub.includes('@')) {
    return String(sub).split('@')[0];
  }
  return String(sub).split('|')[1];
}

function generateUserName() {
  let adj = getRandomInt(0, adjektiv.length);
  let sub = getRandomInt(0, substantiv.length);
  return (
    capitalizeFirstLetter(adjektiv[adj]) +
    capitalizeFirstLetter(substantiv[sub]) +
    clamp(adj + sub, 0, 5000)
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
