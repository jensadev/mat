const Meal = require('../models/meal.model');
const Dish = require('../models/dish.model');
const { validationResult  } = require('express-validator');

module.exports.index = async (req, res) => {
  let meals = await Meal.find();
  return res.status(200).json(meals);
};

module.exports.show = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let meal = await Meal.find(req.params.id);

  if (meal) {
    return res.status(200).json(meal);
  }
  return res.status(404).json({ errors: 'Object not found' }); 
};

module.exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.table(errors.array())
    return res.status(400).json({ errors: errors.array() });
  }
  let dish;

  if (!req.body.dish_id) {
    dish = await Dish.find(req.body.dish);
    dish = dish[0];
    if (!dish) {
      dish = new Dish(null, req.body.dish);
      dish = await dish.save();
    }
  }

  try {
    let meal = new Meal(null, req.body.dish_id == 'undefined' ? req.body.dish_id : dish.id, req.body.type_id, req.user.id, null, null, req.body.date || null);
    const result = await meal.save();
    if (result) {
      return res.send(result);
    }
    return res.status(400).json({ errors: 'Invalid request' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errors: 'Invalid request' });
  }
};

module.exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let meal = await Meal.find(req.params.id);

  if (typeof meal === 'undefined') {
    return res.status(400).json({ errors: 'Invalid request' });
  }

  meal.dishId = req.body.dish_id || meal.dishId;
  meal.typeId = req.body.type_id || meal.typeId;
  meal.date = req.body.date || meal.date;

  const result = await meal.save();
  if (result) {
    return res.send(meal);
  }
  return res.status(400).json({ errors: 'Invalid request' });  
};

module.exports.destroy = async (req, res) => {
  const result = await Meal.delete(req.params.id);
  if (result == 0) {
    return res.status(400).json({ errors: 'Invalid request' });
  }
  return res.send('Meal deleted');
};