const { Meal, User, Dish, Mealtype, User_Dish } = require('../models/');
const { validationResult } = require('express-validator');
const { splitSub } = require('../utils/splitsub');

module.exports.index = async (req, res) => {
  try {
    console.table(req.user.sub);
    const getMeals = await Meal.findAll({
      include: [
        {
          model: Dish
          // where: { name: 'Dish name'}
        },
        {
          model: User
        },
        {
          model: Mealtype
        }
      ]
    });

    // console.table(getMeals[0].dataValues);

    const meals = [];
    if (getMeals)
      for (let meal of getMeals) {
        meals.push(meal.dataValues);
      }
    res.status(200).json({ meals });
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
    const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });

    if (!user) {
      throw new Error('User does not exist');
    }

    const [dish] = await Dish.findOrCreate({
      where: { name: req.body.dish }
    });

    await User_Dish.findOrCreate({
      where: { userId: user.id, dishId: dish.id }
    });

    let meal = await Meal.create({
      date: req.body.date,
      userId: user.id,
      dishId: dish.id,
      typeId: req.body.typeId
    });

    res.status(201).json({ meal });
  } catch (e) {
    return res.status(422).json({
      errors: { body: ['Could not create meal', e.message] }
    });
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array());
    }
    let meal = await Meal.findByPk(req.params.id);

    console.log(req.params.id);

    if (!meal) {
      res.status(404);
      throw new Error('Meal not found');
    }

    const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });

    if (user.id != meal.userId) {
      res.status(403);
      throw new Error('You must be the creator to modify this meal');
    }

    await Meal.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422;
    return res.status(code).json({
      errors: { body: ['Could not create article', e.message] }
    });
  }
};

module.exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array());
    }

    let meal = await Meal.findByPk(req.body.id);

    if (!meal) {
      res.status(404);
      throw new Error('Meal not found');
    }

    const user = await User.findOne({ where: { sub: splitSub(req.user.sub) } });

    if (user.id != meal.userId) {
      res.status(403);
      throw new Error('You must be the creator to modify this meal');
    }

    const [dish] = await Dish.findOrCreate({
      where: { name: req.body.dish }
    });

    await User_Dish.findOrCreate({
      where: { userId: user.id, dishId: dish.id }
    });

    const date = req.body.date ? req.body.date : meal.date;
    const typeId = parseInt(req.body.typeId)
      ? parseInt(req.body.typeId)
      : meal.typeId;
    const dishId = dish.id;
    const userId = user.id;

    const updatedMeal = await meal.update({ date, typeId, dishId, userId });

    res.status(200).json({ updatedMeal });
  } catch (e) {
    return res.status(422).json({
      errors: { body: ['Could not update meal', e.message] }
    });
  }
};
