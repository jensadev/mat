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

      const meal = new Meal({ name: 'Korv med bröd', type_id: 2, date: new Date().toISOString().split('T')[0] });
      const meal2 =  new Meal({ name: 'Laxsoppa', type_id: 3, date: new Date().toISOString().split('T')[0] });

      await meal.save();
      await meal2.save();

      const res = await request(app).get('/api/meals');
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe('GET /:id', () => {
    it('should return a meal if valid id is passed', async () => {
      const meal = new Meal({ name: 'Fiskpinnar med potatismos', type_id: 2, date: new Date().toISOString().split('T')[0] });
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

  describe('POST /', () => {
    it('should return a meal when the request body is valid', async () => {
      const res = await request(app)
        .post('/api/meals')
        .send({
          name: 'Tacos',
          type_id: 3,
          date: new Date().toISOString().split('T')[0]
        });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('name', 'Tacos');
    });

    it('should return 400 when request body is invalid', async () => {
      const res = await request(app)
        .post('/api/meals')
        .send({ name: '', type_id: 'Glass', date: '19821312' });
      expect(res.status).to.equal(400);
    });

    // add more tests to validate request body accordingly eg, make sure name is more than 3 characters etc
  });

  describe('PUT /:id', () => {
    it('should update the existing meal and return 200', async () => {
      const meal = new Meal({ name: 'Korv med bröd', type_id: 2, date: new Date().toISOString().split('T')[0] });
      await meal.save();

      const res = await request(app)
        .put('/api/meals/' + meal.id)
        .send({
          name: 'Hamburgare',
          type_id: 3,
          date: new Date().toISOString().split('T')[0]
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Hamburgare');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete requested id and return response 200', async () => {
      const meal = new Meal({ name: 'Pannkakor', type_id: 1, date: new Date().toISOString().split('T')[0] });
      await meal.save();

      const res = await request(app).delete('/api/meals/' + meal.id);
      expect(res.status).to.be.equal(200);
    });

    it('should return 404 when deleted meal is requested', async () => {
      const meal = new Meal({ name: 'Pannkakor', type_id: 1, date: new Date().toISOString().split('T')[0] });
      await meal.save();

      let res = await request(app).delete('/api/meals/' + meal.id);
      expect(res.status).to.be.equal(200);

      res = await request(app).get('/api/meals/' + meal.id);
      expect(res.status).to.be.equal(404);
    });
  });
});