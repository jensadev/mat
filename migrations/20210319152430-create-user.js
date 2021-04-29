'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            // sub: {
            //   allowNull: false,
            //   type: Sequelize.STRING,
            //   unique: true
            // },
            handle: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            family: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            public: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            bio: {
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.addIndex('Users', ['email']);
        await queryInterface.addIndex('Users', ['public']);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};
