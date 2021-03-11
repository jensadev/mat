const jwt = require('jsonwebtoken');
const { query } = require("./db.model");
const adjektiv = require('../docs/adjektiv.json');
const substantiv = require('../docs/substantiv.json');
const Meal = require('./meal.model');
const Dish = require('./dish.model');

class User {
  constructor(id, email, password) {
    this.name = this.generateUserName();
    this.email = email;
    this.password = password;
    this.id = typeof id === "undefined" ? null : id;
    // console.table(this);
  }

  async save() {
    if (this.id === null) {
      try {
        const sql = `INSERT INTO users 
        (name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, now(), now())`;
        const result = await query(sql, [this.name, this.email, this.password]);
        this.id = result.insertId;
        return this.id;
      } catch (e) {
        console.error(e);
      }
    } else {
      // updated existing
    }
  }

  static async meals(userId) {
    return await Meal.find(null, userId);
  }

  static async dishes(param = null, userId) {
    return await Dish.find(param, userId);
  }

  static async find(field, value) {
    if (field) {
      try {
        const sql = "SELECT * FROM users WHERE ?? = ?";
        const result = await query(sql, [field, value]);
        const user = new User(result[0].id, result[0].email, result[0].password);
        return user;
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const sql = "SELECT * FROM users";
        const result = await query(sql);
        const users = [];
        result.forEach((element) => {
          users.push(new User(...element));
        });
        return users;
      } catch (e) {
        console.error(e);
      }
    }
  }

  generateToken() {
    // eslint-disable-next-line no-undef
    return jwt.sign({ data: {id: this.id, name: this.name, email: this.email} }, process.env.SECRET, { expiresIn: '24h' });
  }

  generateUserName() {
    let adj = this.getRandomInt(0, adjektiv.length);
    let sub = this.getRandomInt(0, substantiv.length);
    return (
      this.capitalizeFirstLetter(adjektiv[adj]) + 
      this.capitalizeFirstLetter(substantiv[sub]) + 
      this.clamp(adj+sub, 0, 5000)
      )
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  
  clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
  }
  
  capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

}

module.exports = User;
