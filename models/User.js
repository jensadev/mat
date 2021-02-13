const bcrypt = require("bcrypt");
const { query } = require("./Database");

class User {
  constructor(obj) {
    if ( typeof obj === 'undefined') {
      throw 'Error: Undefined object';
    }
    this.name = obj.name;
    this.email = obj.email;
    this.password = obj.password;
    this.id = typeof obj.id === "undefined" ? null : obj.id;
  }

  async save() {
    if (this.id === null) {
      try {
        const sql =
          "INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, now(), now())";
        const result = await query(sql, [this.name, this.email, this.password]);
        this.id = result.insertId;
      } catch (e) {
        console.error(e);
      }
    } else {
      // updated existing
    }
  }

  static async find(userId = null) {
    if (userId) {
      try {
        const sql = "SELECT * FROM users WHERE id = ?";
        const result = await query(sql, userId);
        const user = new User(result[0]);
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
          users.push(new User(element));
        });
        return users;
      } catch (e) {
        console.error(e);
      }
    }
  }
}

module.exports = User;
