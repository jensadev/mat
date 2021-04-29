'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dish extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Dish.belongsToMany(models.User, { through: 'User_Dish' });
            Dish.hasMany(models.User_Dish);
            Dish.hasMany(models.Meal, {
                foreignKey: 'dishId',
                onDelete: 'CASCADE'
            });
        }
    }
    Dish.init(
        {
            name: { type: DataTypes.STRING, allowNull: false, unique: true }
        },
        {
            sequelize,
            modelName: 'Dish'
        }
    );
    return Dish;
};
