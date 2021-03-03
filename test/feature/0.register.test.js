const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const { query } = require('../../models/db.model');

describe('api/auth/register', () => {
  before(async () => {
    await query('TRUNCATE TABLE users');
    await query('TRUNCATE TABLE meals');
  });

  describe('POST /', () => {
    it('should create a new user when request is valid', (done) => {
      request(app)
      .post('/api/auth/register')
      .send({
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('email');
        expect(res.body).to.have.property('email', process.env.TEST_EMAIL);
        return done();
      });
    });

    it('should fail to create a user with a invalid request body', (done) => {
      request(app)
      .post('/api/auth/register')
      .send({})
      .expect(400)
      .end(done);
    });
  });
});
