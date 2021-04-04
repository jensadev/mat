const { Meal, User, Dish, User_Dish } = require('../models/');
const { validationResult } = require('express-validator');
const paginate = require('jw-paginate');

module.exports.index = async (req, res) => {
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

module.exports.store = async (req, res) => {
  try {
    validationResult(req).throw();
    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw new Error('User does not exist');
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
      typeId: req.body.meal.typeId
    });

    res.status(201).json({ meal });
  } catch (e) {
    return res.status(422).json({
      errors: { body: ['Could not create meal', e.message || e.mapped()] }
    });
  }
};

module.exports.destroy = async (req, res) => {
  try {
    validationResult(req).throw();
    let meal = await Meal.findByPk(req.params.id);
    if (!meal) {
      res.status(404);
      throw new Error('Meal not found');
    }

    const user = await User.findByPk(req.user.id);
    if (user.id != meal.userId) {
      res.status(403);
      throw new Error('You must be the creator to modify this meal');
    }

    await Meal.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422;
    return res.status(code).json({
      errors: { body: ['Could not delete meal', e.message || e.mapped()] }
    });
  }
};

module.exports.update = async (req, res) => {
  try {
    validationResult(req).throw();

    let meal = await Meal.findByPk(req.body.meal.id);

    if (!meal) {
      res.status(404);
      throw new Error('Meal not found');
    }

    const user = await User.findByPk(req.user.id);
    if (user.id != meal.userId) {
      res.status(403);
      throw new Error('You must be the creator to modify this meal');
    }

    const [dish] = await Dish.findOrCreate({
      where: { name: req.body.meal.dish }
    });

    await User_Dish.findOrCreate({
      where: { userId: user.id, dishId: dish.id }
    });

    const date = req.body.meal.date ? req.body.meal.date : meal.date;
    const typeId = parseInt(req.body.meal.typeId)
      ? parseInt(req.body.meal.typeId)
      : meal.typeId;
    const dishId = dish.id;
    const userId = user.id;

    const updatedMeal = await meal.update({ date, typeId, dishId, userId });

    res.status(200).json({ updatedMeal });
  } catch (e) {
    return res.status(422).json({
      errors: { body: ['Could not update meal', e.message || e.mapped()] }
    });
  }
};
