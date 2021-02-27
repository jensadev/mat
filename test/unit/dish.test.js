const Dish = require('../../models/dish.model');
const request = require('supertest');
const { expect, assert } = require('chai');
// const app = require('../app');

// begin a test suite of one or more tests
describe('Dish unit', () => {
  context('without arguments', () => {
    it('should throw an error', () => {
      expect(() => new Dish()).to.throw('Property required');
    });
  });

  context('with arguments', () => {
    it('should return an object', () => {
      let dish = new Dish(null, 'Fläsklägg med rotmos', 1);
      expect(dish).to.be.an('object');
    });

    it('should return an object with properties', () => {
      let dish = new Dish(null, 'Fiskpinnar', 1);
      expect(dish).to.be.an('object')
      .that.has.property('name').that.includes('Fiskpinnar');
    });
  });


  // ...some more tests
  
})


