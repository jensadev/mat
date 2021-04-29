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
            User.belongsToMany(models.Dish, { through: 'User_Dish' });
            User.hasMany(models.User_Dish);
            User.hasMany(models.Meal, {
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            });
        }
    }
    User.init(
        {
            // sub: { type: DataTypes.STRING, allowNull: false, unique: true },
            handle: { type: DataTypes.STRING, allowNull: false, unique: true },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false },
            family: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            public: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'User'
        }
    );
    return User;
};
