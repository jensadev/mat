const { query } = require("./db.model");
const adjektiv = require('../docs/adjektiv.json');
const substantiv = require('../docs/substantiv.json');
const Meal = require('./meal.model');
const Dish = require('./dish.model');

class User {
  constructor(id, sub) {
    this.name = this.generateUserName();
    this.sub = sub;
    this.id = typeof id === "undefined" ? null : id;
  }

  async save() {
    if (this.id === null) {
      const sql = `INSERT INTO
      users(name, sub, created_at, updated_at)
      SELECT ?, ?, now(), now()
      WHERE NOT EXISTS (
        SELECT sub
        FROM users
        WHERE sub = ?)`;
      const result = await query(sql, [this.name, this.sub, this.sub]);
      console.table(result);
      if (result.insertId) {
        this.id = result.insertId;
        return this.id;
      } else {
        return false;
      }
    } else {
      // updated existing
    }
  }

  async hasDish(dishId) {
    const sql = `INSERT INTO
      user_has_dish(dish_id, user_id, created_at, updated_at)
      SELECT ?, ?, now(), now()
      WHERE
        NOT EXISTS (
          SELECT dish_id, user_id
          FROM user_has_dish
          WHERE dish_id = ? AND user_id = ?
        )`;
    const result = await query(sql, [dishId, this.id, dishId, this.id]);
    if (result.insertId) {
      return result.insertId;
    } else {
      return false;
    }
  }

  static async meals(userId) {
    return await Meal.find(null, userId);
  }

  static async dishes(param = null, userId) {
    return await Dish.find(param, userId);
  }

  static getSub(sub) {
    return String(sub).split('|')[1];
  }

  static async find(field, value) {
    // console.log(field,value)
    if (field) {
      const sql = "SELECT * FROM users WHERE ?? = ?";
      const result = await query(sql, [field, value]);
      if (result) {
        const user = new User(result[0].id, result[0].sub);
        return user;
      }
    // } else {
    //   try {
    //     const sql = "SELECT * FROM users";
    //     const result = await query(sql);
    //     const users = [];
    //     result.forEach((element) => {
    //       users.push(new User(...element));
    //     });
    //     return users;
    //   } catch (e) {
    //     console.error(e);
    //   }
    }
  }

  // generateToken() {
  //   // eslint-disable-next-line no-undef
  //   return jwt.sign({ data: {id: this.id, name: this.name, email: this.email} }, process.env.SECRET, { expiresIn: '24h' });
  // }

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
