const { User, Dish, Meal, User_Dish } = require('../models');
const { validationResult } = require('express-validator');
const sequelize = require('sequelize');

module.exports.index = async (req, res) => {
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

  const getDishes = await User_Dish.findAll({
    attributes: [],
    where: { userId: user.id },
    order: [['updatedAt', 'DESC']],
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
  return res.status(200).json({ dishes });
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

  let dish = await Dish.findByPk(req.params.id, {
    attributes: ['id']
  });

  if (!dish) {
    return res.status(404).json({
      errors: {
        dish: req.t('error.notfound')
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

  const userHasDish = await User_Dish.findOne({
    where: { userId: user.id, dishId: dish.id }
  });

  if (!userHasDish) {
    return res.status(403).json({
      errors: {
        dish: req.t('belongsto', { owner: req.t('user.user') })
      }
    });
  }

  const usersHasDish = await User_Dish.findAll({
    where: { dishId: dish.id }
  });

  if (usersHasDish.length > 1) {
    await userHasDish.destroy();
  } else {
    if (usersHasDish[0].dataValues.userId === user.id) {
      await userHasDish.destroy();
      await dish.destroy();
    }
  }

  return res.status(200).json({
    message: req.t('deleted', { what: req.t('dish.dish') })
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

  let dish = await Dish.findByPk(req.body.dish.id);

  if (!dish) {
    return res.status(404).json({
      errors: {
        dish: req.t('error.notfound')
      }
    });
  }

  const user = await User.findByPk(req.user.id, {
    attributes: ['id']
  });

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

    await Meal.findAll({
      where: { dishId: dish.id, userId: user.id },
      attributes: ['dishId']
    }).success((instances) => {
      instances.forEach((instance) => {
        instance.updateAttributes({ dishId: newDish.id });
      });
    });

    return res.status(200).json({ newDish });
  } else {
    if (usersHasDish[0].dataValues.userId === user.id) {
      const name = req.body.dish.name ? req.body.dish.name : dish.name;
      const updatedDish = await dish.update({ name });
      return res.status(200).json({ updatedDish });
    }
  }
};

module.exports.top = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      errors: {
        user: req.t('error.notfound')
      }
    });
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

  return res.status(200).json({ dishes });
};

module.exports.menu = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      errors: {
        user: req.t('error.notfound')
      }
    });
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
};

module.exports.suggest = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({
      errors: {
        user: req.t('error.notfound')
      }
    });
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
};
