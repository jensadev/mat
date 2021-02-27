const Meal = require('../models/meal.model');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');

describe('api/meals', async () => {
  let token;

  before((done) => {
    request(app)
    .post('/api/auth/login')
    .type('form')
    .send({
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD
    })
    .end((err, res) => {
      if (err) throw err;
      token = res.body.token;
      return done();
    });
  });

  describe('GET /', () => {
    it('should return all meals', async () => {

      const meal = new Meal(null, 'Korv med bröd', 2);
      await meal.save();
      const meal2 =  new Meal(null, 'Laxsoppa', 3);
      await meal2.save();

      const res = await request(app).get('/api/meals');
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe('GET /:id', () => {
    let meal;
    before(async () => {
      meal = new Meal(null, 'Fiskpinnar med potatismos', 2);
      meal = await meal.save();
      return meal;
    });

    it('should return a meal if valid id is passed',  (done) => {
      request(app)
      .get('/api/meals/' + meal.id)
      .expect(200).
      end((err, res) => {
        if (err) throw err;
        expect(res.body).to.have.property('name', meal.name);
        return done();
      });
    });

    it('should return 400 error when invalid object id is passed', (done) => {
      request(app)
      .get('/api/meals/e')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        return done();
      });
    });

    it('should return 404 error when valid object id is passed but does not exist', (done) => {
      request(app)
      .get('/api/meals/533')
      .end((err, res) => {
        if (err) throw err;
        return done();
      });
    });
  });

  describe('POST /', () => {
    it('should create a meal when the request body is valid', (done) => {
      request(app)
      .post('/api/meals')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Tacos',
        type_id: 3,
        date: new Date().toISOString().split('T')[0]
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'Tacos');
        return done();  
      });
    });

    it('should return 400 when request body is invalid', (done) => {
      request(app)
      .post('/api/meals')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: '', type_id: 'Glass', date: '19821312' })
      .expect(400)
      .end(done);
    });

    // add more tests to validate request body accordingly eg, make sure name is more than 3 characters etc
  });

  describe('PUT /:id', () => {
    let meal;
    before(async () => {
      meal = new Meal(null, 'Fiskpinnar med potatismos', 2);
      meal = await meal.save();
      return meal;
    });

    it('should update the existing meal', (done) => {
      request(app)
      .put('/api/meals/' + meal.id)
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Hamburgare',
        type_id: 3,
        date: new Date().toISOString().split('T')[0]
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body).to.have.property('name', 'Hamburgare');
        return done();
      });
    });
  });

  describe('DELETE /:id', () => {
    let meal;
    before(async () => {
      meal = new Meal(null, 'Fiskpinnar med potatismos', 2);
      meal = await meal.save();
      return meal;
    });

    it('should delete id and return 404 when deleted meal is requested', (done) => {
      request(app)
      .delete('/api/meals/' + meal.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        request(app)
        .get('/api/meals/' + meal.id)
        .expect(404)
        .end();
        return done();
      });
    });
  });
});