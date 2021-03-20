const { Meal } = require('../models/');

module.exports.index = async (req, res) => {
  try {
    const getMeals = await Meal.findAll();
    //       {include: [{model: User}]}

    console.table(getMeals);

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
