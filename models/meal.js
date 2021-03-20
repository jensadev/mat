'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Meal.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Meal.belongsTo(models.Dish, {
        foreignKey: 'dishId'
      });
      Meal.belongsTo(models.Mealtype, {
        foreignKey: 'typeId'
      });
    }
  }
  Meal.init(
    {
      date: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Meal'
    }
  );
  return Meal;
};
