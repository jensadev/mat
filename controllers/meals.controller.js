const Meal = require('../models/meal.model');
const { body, validationResult  } = require('express-validator');

module.exports.index = async (req, res) => {
  let meals = await Meal.find();
  return res.send(meals);
};

module.exports.show = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let meal = await Meal.find(req.params.id);

  if (meal) {
    return res.send(meal);
  }
  return res.status(404).json({ errors: 'Object not found' }); 
};

module.exports.store = async (req, res) => {
  const errors = validationResult(req);
  console.table(req.body)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let meal = new Meal(null, req.body.dish_id, req.body.type_id, req.body.date);
  const result = await meal.save();
  if (result) {
    return res.send(meal);
  }
  return res.status(400).json({ errors: 'Invalid request' });
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

  meal.dish_id = req.body.dish_id;
  meal.type_id = req.body.type_id;
  meal.date = req.body.date;

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