const jwt = require('jsonwebtoken');
const { query } = require("./db.model");

class User {
  constructor(id, email, password) {
    this.email = email;
    this.password = password;
    this.id = typeof id === "undefined" ? null : id;
    // console.table(this);
  }

  async save() {
    if (this.id === null) {
      try {
        const sql =
          "INSERT INTO users (email, password, created_at, updated_at) VALUES (?, ?, now(), now())";
        const result = await query(sql, [this.email, this.password]);
        this.id = result.insertId;
        return this.id;
      } catch (e) {
        console.error(e);
      }
    } else {
      // updated existing
    }
  }

  generateToken() {
    // eslint-disable-next-line no-undef
    return jwt.sign({ data: this.email }, process.env.SECRET, { expiresIn: '24h' });
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
}

module.exports = User;
