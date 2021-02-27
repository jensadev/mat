const Dish = require('../../models/dish.model');
const request = require('supertest');
const { expect, assert } = require('chai');
const { query } = require('../../models/db.model');
// const app = require('../app');

describe('dish', () => {
  before(async () => {
    await query('TRUNCATE TABLE dishes', []);
  });

  describe('searchDish', () => {
    it('should return all matching dishes', async () => {
      const dish = new Dish(null, 'Korv med bröd', 1);
      await dish.save();
      const dish2 =  new Dish(null, 'Falukorv med makaroner', 1);
      await dish2.save();
      const dish3 = new Dish(null, 'Korvsoppa', 1);
      await dish3.save();

      let dishes = await Dish.search('korv');
      expect(dishes.length).to.equal(3);
    });
  });
})