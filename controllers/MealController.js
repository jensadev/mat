const Meal = require('../models/Meal');
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

  let id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ errors: 'Invalid id'});
  }

  let meal = await Meal.find(id);

  if (!meal) {
    return res.status(404).json({ errors: 'Object not found' });
  }
  return res.send(meal);
};

module.exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let meal = new Meal({
    name: req.body.name,
    type_id: req.body.type_id,
    date:  req.body.date
  });
  const result = await meal.save();
  if (result == 0) {
    return res.status(400).json({ errors: 'Invalid request' });
  }

  return res.send(meal);
};

module.exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let id = parseInt(req.params.id);
  let meal = await Meal.find(id);
  if (typeof meal === 'undefined') {
    return res.status(400).json({ errors: 'Invalid request' });
  }
  const result = await meal.save(req.body);
  if (result == 0) {
    return res.status(400).json({ errors: 'Invalid request' });
  }
  return res.send(meal);
};

module.exports.destroy = async (req, res) => {
  let id = parseInt(req.params.id);
  const result = await Meal.delete(id);
  if (result == 0) {
    return res.status(400).json({ errors: 'Invalid request' });
  }
  return res.send('Meal deleted');
};