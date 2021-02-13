const Meal = require('../models/Meal');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const { query } = require('../models/Database');

describe('api/meals', () => {
  beforeEach(async () => {
    await query('truncate table meals');
  });

  describe('GET /', () => {
    it('should return all meals', async () => {

      const meal = new Meal({ name: 'Korv med bröd', type: 2, date: new Date().toISOString().split('T')[0] });
      const meal2 =  new Meal({ name: 'Laxsoppa', type: 3, date: new Date().toISOString().split('T')[0] });

      await meal.save();
      await meal2.save();

      const res = await request(app).get('/api/meals');
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe('GET /:id', () => {
    it('should return a meal if valid id is passed', async () => {
      const meal = new Meal({ name: 'Fiskpinnar med potatismos', type: 2, date: new Date().toISOString().split('T')[0] });
      await meal.save();

      const res = await request(app).get('/api/meals/' + meal.id);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', meal.name);
    });

    it('should return 400 error when invalid object id is passed', async () => {
      const res = await request(app).get('/api/meals/e');
      expect(res.status).to.equal(400);
    });

    it('should return 404 error when valid object id is passed but does not exist', async () => {
      const res = await request(app).get('/api/meals/213534534');
      expect(res.status).to.equal(404);
    });
  });
});