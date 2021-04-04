const { User, Dish, Meal, User_Dish } = require('../models');
const { validationResult } = require('express-validator');
const sequelize = require('sequelize');

module.exports.index = async (req, res) => {
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
          attributes: ['id', 'name']
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

module.exports.destroy = async (req, res) => {
  try {
    validationResult(req).throw();

    let dish = await Dish.findByPk(req.params.id);
    if (!dish) {
      res.status(404);
      throw new Error('Dish not found');
    }

    const user = await User.findByPk(req.user.id);

    const userHasDish = await User_Dish.findOne({
      where: { userId: user.id, dishId: dish.id }
    });

    if (!userHasDish) {
      res.status(403);
      throw new Error('You must be the creator to modify this dish');
    }

    const usersHasDish = await User_Dish.findAll({
      where: { dishId: dish.id }
    });

    if (usersHasDish.length > 1) {
      await User_Dish.destroy({ where: { dishId: dish.id, userId: user.id } });
    } else {
      if (usersHasDish[0].dataValues.userId === user.id) {
        await User_Dish.destroy({
          where: { dishId: dish.id, userId: user.id }
        });
        await Dish.destroy({ where: { id: dish.id } });
      }
    }

    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422;
    return res.status(code).json({
      errors: { body: ['Could not delete dish', e.message || e.mapped()] }
    });
  }
};

module.exports.update = async (req, res) => {
  console.table(req.body);
  try {
    validationResult(req).throw();

    let dish = await Dish.findByPk(req.body.dish.id);

    if (!dish) {
      res.status(404);
      throw new Error('Dish not found');
    }

    const user = await User.findByPk(req.user.id);

    const usersHasDish = await User_Dish.findAll({
      where: { dishId: dish.id }
    });

    if (usersHasDish.length > 1) {
      let newDish = await Dish.create({
        name: req.body.dish.name
      });
      await User_Dish.findOrCreate({
        where: { userId: user.id, dishId: newDish.id }
      });
      await User_Dish.destroy({ where: { dishId: dish.id, userId: user.id } });
      res.status(200).json({ newDish });
    } else {
      if (usersHasDish[0].dataValues.userId === user.id) {
        const name = req.body.dish.name ? req.body.dish.name : dish.name;
        const updatedDish = await dish.update({ name });
        res.status(200).json({ updatedDish });
      }
    }
  } catch (e) {
    return res.status(422).json({
      errors: { body: ['Could not update dish', e.message || e.mapped()] }
    });
  }
};

module.exports.top = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
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
          model: Dish,
          attributes: ['name']
        }
      ],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10
    });

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

module.exports.menu = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User id not valid');
    }

    const getDishes = await User_Dish.findAll({
      attributes: [],
      where: { userId: user.id },
      include: [
        {
          model: Dish,
          attributes: ['name']
        }
      ],
      order: [[sequelize.literal('rand()'), 'DESC']],
      // order: [sequelize.fn('rand'), 'dishId'],
      limit: 7
    });

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

module.exports.suggest = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User id not valid');
    }

    const getDish = await User_Dish.findOne({
      attributes: [],
      where: { userId: user.id },
      include: [
        {
          model: Dish,
          attributes: ['name']
        }
      ],
      order: [[sequelize.literal('rand()'), 'DESC']],
      // order: [sequelize.fn('rand'), 'dishId'],
      limit: 7
    });

    const dish = getDish.dataValues.Dish;

    res.status(200).json({ dish });
  } catch (e) {
    res.status(422).json({ errors: { body: [e.message] } });
  }
};
