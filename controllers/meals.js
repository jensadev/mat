const { Meal, User, Dish, User_Dish } = require('../models/');
const { validationResult } = require('express-validator');
const paginate = require('jw-paginate');
const sequelize = require('sequelize');

module.exports.index = async (req, res) => {
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

  const user = await User.findByPk(req.user.id, {
    attributes: ['id']
  });
  if (!user) {
    res.status(404).json({
      errors: {
        user: req.t('error.notfound')
      }
    });
  }

  const getMeals = await Meal.findAll({
    attributes: ['id', 'date', 'type'],
    where: { userId: user.id },
    order: [
      // ['date', 'DESC'],
      [sequelize.fn('date', sequelize.col('date')), 'DESC'],
      ['type', 'DESC']
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
  const maxPages = 5;
  const pager = paginate(meals.length, page, pageSize, maxPages);
  const pageOfItems = meals.slice(pager.startIndex, pager.endIndex + 1);

  res.status(200).json({ pager, pageOfItems });
};

module.exports.store = async (req, res) => {
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

  const user = await User.findByPk(req.user.id, {
    attributes: ['id']
  });
  if (!user) {
    res.status(404).json({
      errors: {
        user: req.t('error.notfound')
      }
    });
  }

  const [dish] = await Dish.findOrCreate({
    where: { name: req.body.meal.dish }
  });

  await User_Dish.findOrCreate({
    where: { userId: user.id, dishId: dish.id }
  });

  let meal = await Meal.create({
    date: req.body.meal.date,
    userId: user.id,
    dishId: dish.id,
    type: req.body.meal.type
  });
  delete meal.dataValues.createdAt;
  delete meal.dataValues.updatedAt;
  res.status(201).json({ meal });
};

module.exports.destroy = async (req, res) => {
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

  let meal = await Meal.findByPk(req.params.id, {
    attributes: ['id', 'userId']
  });
  if (!meal) {
    return res.status(404).json({
      errors: {
        meal: req.t('error.notfound')
      }
    });
  }

  const user = await User.findByPk(req.user.id, {
    attributes: ['id']
  });
  if (!user) {
    return res.status(404).json({
      errors: {
        user: req.t('error.notfound')
      }
    });
  }

  if (user.id !== meal.userId) {
    return res.status(403).json({
      errors: {
        meal: req.t('belongsto', { owner: req.t('user.user') })
      }
    });
  }

  await meal.destroy();
  return res.status(200).json({
    message: req.t('deleted', { what: req.t('meal.meal') })
  });
};

module.exports.update = async (req, res) => {
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

  let meal = await Meal.findByPk(req.body.meal.id);
  if (!meal) {
    return res.status(404).json({
      errors: {
        meal: req.t('error.notfound')
      }
    });
  }

  const user = await User.findByPk(req.user.id, {
    attributes: ['id']
  });
  if (!user) {
    return res.status(404).json({
      errors: {
        user: req.t('error.notfound')
      }
    });
  }

  if (user.id !== meal.userId) {
    return res.status(403).json({
      errors: {
        meal: req.t('belongsto', { owner: req.t('user.user') })
      }
    });
  }

  const [dish] = await Dish.findOrCreate({
    where: { name: req.body.meal.dish }
  });

  await User_Dish.findOrCreate({
    where: { userId: user.id, dishId: dish.id }
  });

  const date = req.body.meal.date ? req.body.meal.date : meal.date;
  const type = parseInt(req.body.meal.type)
    ? parseInt(req.body.meal.type)
    : meal.type;
  const dishId = dish.id;
  const userId = user.id;

  const updatedMeal = await meal.update({ date, type, dishId, userId });
  delete updatedMeal.dataValues.createdAt;
  delete updatedMeal.dataValues.updatedAt;
  res.status(200).json({ updatedMeal });
};
