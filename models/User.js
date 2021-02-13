const bcrypt = require('bcrypt');
const { query } = require('./Database');

class User {
  constructor(obj) {
    this.name = obj.name;
    this.email = obj.email;
    this.password = obj.password;
    this.id = null || obj.id;
  }

  async save () {
    if (this.id === null) {
      try {
        const sql = 'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, now(), now())';
        const result = await query(sql, [this.name, this.email, this.password]);
        this.id = result.insertId;
      } catch (e) {
        console.error(e);
      }  
    } else {
      // updated existing
    }
  }

  static async find (userId = null) {
    if (userId != null) {
      try {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const result = await query(sql, userId);
        const user = new User(result[0]);
      } catch (e) {
        console.log(e);
      }  
    }
  }
}

module.exports = User;