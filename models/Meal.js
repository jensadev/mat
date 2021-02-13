const { query } = require('./Database');

class Meal {
  constructor(obj) {
    if ( typeof obj === 'undefined') {
      throw 'Error: Undefined object';
    }
    this.name = obj.name;
    this.type = obj.type;
    this.date = obj.date;
    this.id = typeof obj.id === 'undefined' ? null : obj.id;
  }

  async save(obj = {}) {
    if (this.id) {
      try {
        const sql =
          'UPDATE meals SET name = ?, type_id = ?, date = ?, updated_at = now()) WHERE id = ?';
        const result = await query(sql, [
          obj.name,
          obj.type,
          obj.date,
          this.id
        ]);
        return result;
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const sql =
          'INSERT INTO meals (name, type_id, date, created_at, updated_at) VALUES (?, now(), now())';
        const result = await query(sql, [this.name, this.type, this.date]);
        this.id = result.insertId;
      } catch (e) {
        console.error(e);
      }
    }
  }

  static async find(id = null) {
    if (id) {
      try {
        const sql = 'SELECT * FROM meals WHERE id = ? LIMIT 1';
        const result = await query(sql, id);
        const meal = new Meal(result[0]);
        return meal;
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const sql = 'SELECT * FROM meals ORDER BY date DESC';
        const result = await query(sql);
        const meals = [];
        result.forEach((element) => {
          meals.push(new Meal(element));
        });
        return meals;
      } catch (e) {
        console.error(e);
      }
    }
  }
}

module.exports = Meal;
