const Meal = require('../models/Meal');

module.exports.index = async (req, res) => {
  let meals = await Meal.find();
  return res.send(meals);
};

module.exports.show = async (req, res) => {
  let id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).send('Invalid object id');
  }
  
  let meal = await Meal.find(id);

  if (!meal) {
    return res.status(404).send('Object not found');
  }
  return res.send(meal);
};