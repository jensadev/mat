'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Dish, { through: 'User_Dish'});
      User.hasMany(models.User_Dish);
      User.hasMany(models.Meal, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init(
    {
      sub: { type: DataTypes.STRING, allowNull: false, unique: true },
      nickname: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );
  return User;
};