const Meal = require('../models/Meal');

module.exports.index = async (req, res) => {
  let meals = await Meal.find();
  return res.send(meals);
};

module.exports.show = async (req, res) => {
  let id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).send('Invalid id type');
  }
  
  let meal = await Meal.find(id);

  if (!meal) {
    return res.status(404).send('Object not found');
  }
  return res.send(meal);
};

module.exports.store = async (req, res) => {
  let meal = new Meal({
    name: req.body.name,
    type_id: req.body.type_id,
    date: new Date().toISOString().split('T')[0]
  });
  const result = await meal.save();
  if (result == 0) {
    return res.status(400).send('Invalid request');
  }

  return res.send(meal);
};

module.exports.update = async (req, res) => {
  let id = parseInt(req.params.id);
  let meal = await Meal.find(id);
  if (typeof meal === 'undefined') {
    return res.status(500).send('Error: Meal undefined');
  }
  const result = await meal.save(req.body);
  if (result == 0) {
    return res.status(400).send('Invalid request');
  }
  return res.send(meal);
};

module.exports.destroy = async (req, res) => {
  let id = parseInt(req.params.id);
  const result = await Meal.delete(id);
  if (result == 0) {
    return res.status(400).send('Invalid request');
  }
  return res.send('Meal deleted');
};