// const User = require('../models/User');
// const request = require('supertest');
// const expect = require('chai').expect;
// const app = require('../app');
// const { query } = require('../models/Database');

// describe('api/users', () => {
//   beforeEach(async () => {
//     await query('truncate table users');
//   });

//   describe('GET /', () => {
//     it('should return all users', async () => {

//       const user = new User({ name: 'test', email: 'test@gmail.com', password: 'test' });
//       const user2 =  new User({ name: 'test1', email: 'test1@gmail.com', password: 'test' });

//       await user.save();
//       await user2.save();

//       const res = await request(app).get('/api/users');
//       expect(res.status).to.equal(200);
//       expect(res.body.length).to.equal(2);
//     });
//   });

//   describe('GET /:id', () => {
//     it('should return a user if valid id is passed', async () => {
//       const user = new User({name: 'test', email: 'test@gmail.com', password: 'test'});
//       await user.save();

//       const res = await request(app).get('/api/users/' + user.id);
//       expect(res.status).to.equal(200);
//       expect(res.body).to.have.property('name', user.name);
//     });

//     it('should return 400 error when invalid object id is passed', async () => {
//       const res = await request(app).get('/api/users/e');
//       expect(res.status).to.equal(400);
//     });

//     it('should return 404 error when valid object id is passed but does not exist', async () => {
//       const res = await request(app).get('/api/users/213534534');
//       expect(res.status).to.equal(404);
//     });
//   });
// });