('use strict');

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
      'Users',
      [
        {
          handle: 'FantastiskMakapär2021',
          email: 'test@test.se',
          password:
            '$2b$10$.Fo6pR6oTE28j.bH5Djt1.MP0KSJyEKjIsTrld98ZKRZxRXawNb6e',
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
    // await queryInterface.bulkDelete('Users', null, {
    //   // truncate: true,
    //   // cascade: true,
    //   // restartIdentity: true
    // });
    await queryInterface.dropTable('Users');
  }
};
