const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const { query } = require('../models/db.model');

describe('api/auth/register', () => {
  beforeEach(async () => {
    await query('TRUNCATE TABLE users');
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

    // it('should return 400 when request body is invalid', async () => {
    //   const res = await request(app)
    //     .post('/api/register')
    //     .send({});
    //   expect(res.status).to.equal(400);
    // });
  });
});