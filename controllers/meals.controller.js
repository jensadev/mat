const Meal = require('../models/meal.model');
const User = require('../models/user.model');
const Dish = require('../models/dish.model');
const { validationResult  } = require('express-validator');

// module.exports.index = async (req, res) => {
//   let meals = await Meal.find();
//   return res.status(200).json(meals);
// };

// module.exports.show = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   let meal = await Meal.find(req.params.id);

//   if (meal) {
//     return res.status(200).json(meal);
//   }
//   return res.status(404).json({ errors: 'Object not found' }); 
// };

module.exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.table(errors.array())
    return res.status(400).json({ errors: errors.array() });
  }

  // console.table(req.body)
  const sub = User.getSub(req.user.sub);
  let dish, user;
  try {
     user = await User.find('sub', sub);

    if(!user) {
      user = new User(null, sub);
      user = await user.save();
      if (!user) {
        user = await User.find('sub', sub);
      }
    }
  
  } catch (err) {
    console.error(err);
    return res.status(500);
  }

  try {
    if (!req.body.dish_id) {
      dish = await Dish.find(req.body.dish);
      dish = dish[0];
      if (!dish) {
        dish = new Dish(null, req.body.dish);
        dish = await dish.save(user.id);
      } else {
        let hasdish = await user.hasDish(dish.id);
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500);
  }

  // console.table(dish)
  try {
    let meal = new Meal(
      null,
      typeof req.body.dish_id == 'number' ? req.body.dish_id : dish.id,
      req.body.type_id,
      user.id,
      null,
      null,
      req.body.date || null);
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

// module.exports.update = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   let meal = await Meal.find(req.params.id);
//   meal = meal[0];

//   if (typeof meal === 'undefined') {
//     return res.status(400).json({ errors: 'Invalid request' });
//   }

//   meal.dishId = req.body.dish_id || meal.dishId;
//   meal.typeId = req.body.type_id || meal.typeId;
//   meal.date = typeof req.body.date != 'undefined' ? new Date(req.body.date).toISOString().split('T')[0] : meal.date;

//   const result = await meal.save();
//   if (result) {
//     return res.send(meal);
//   }
//   return res.status(400).json({ errors: 'Invalid request' });  
// };

module.exports.destroy = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const result = await Meal.delete(req.params.id);
  if (result == 0) {
    return res.status(400).json({ errors: 'Invalid request' });
  }
  return res.status(200).json({msg: `Resource with id ${req.params.id} deleted`});
};