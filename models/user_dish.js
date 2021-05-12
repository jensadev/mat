'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User_Dish extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User_Dish.belongsTo(models.User, {
                foreignKey: 'userId'
            });
            User_Dish.belongsTo(models.Dish, {
                foreignKey: 'dishId'
            });
        }
    }
    User_Dish.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'User_Dish'
        }
    );
    return User_Dish;
};
