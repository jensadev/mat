'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert(
            'Meals',
            [
                {
                    date: new Date(),
                    dishId: 1,
                    userId: 1,
                    typeId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    date: new Date(),
                    dishId: 2,
                    userId: 1,
                    typeId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        // try {
        //   await queryInterface.transaction(async (transaction) => {
        //     const options = { transaction };
        //     await queryInterface.query('SET FOREIGN_KEY_CHECKS = 0', options);
        //     await queryInterface.query('TRUNCATE TABLE Meals', options);
        //     await queryInterface.query('SET FOREIGN_KEY_CHECKS = 1', options);
        //   });
        // } catch (error) {
        //   console.log(error);
        // }

        // await queryInterface.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
        // await queryInterface.bulkDelete('Meals', null, {
        //   truncate: true,
        //   cascade: true,
        //   restartIdentity: true
        // });
        // queryInterface.addConstraint(
        // await queryInterface.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
        await queryInterface.dropTable('Meals');
    }
};
