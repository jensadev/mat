const Dish = require('../../models/dish.model');
const request = require('supertest');
const { expect, assert } = require('chai');
const { query } = require('../../models/db.model');
// const app = require('../app');

describe('Dish feature', () => {
  before('truncate table', async () => {
    await query('TRUNCATE TABLE dishes', []);
  });

  describe('search', () => {
    before('create dishes', async () => {
      const dish = new Dish(null, 'Korv med bröd', 1);
      await dish.save();
      const dish2 =  new Dish(null, 'Falukorv med makaroner', 1);
      await dish2.save();
      const dish3 = new Dish(null, 'Korvsoppa', 1);
      await dish3.save();
    });

    it('should return all matching dishes', async () => {
      let dishes = await Dish.search('korv');
      expect(dishes.length).to.equal(2);
    });

    it('should return matching dish', async () => {
      let dish = await Dish.search('korv med bröd');
      expect(dish.name).to.equal('Korv med bröd');
    });
  });
})