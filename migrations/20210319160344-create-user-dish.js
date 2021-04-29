'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('User_Dishes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId'
                }
            },
            dishId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Dishes',
                    key: 'id',
                    as: 'dishId'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
        await queryInterface.addIndex('User_Dishes', ['userId']);
        await queryInterface.addIndex('User_Dishes', ['dishId']);
        await queryInterface.addIndex('User_Dishes', ['userId', 'dishId']);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('User_Dishes');
    }
};
