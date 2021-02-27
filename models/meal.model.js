const { query, pool } = require('./db.model');
const dish = require('./dish.model');

class Meal {
  constructor(id, dish, type, name, date = new Date().toISOString().split('T')[0]) {
    this.name = name ? name : null;
    this.dishId = dish ? dish : null;
    this.typeId = type;
    this.date = date;
    this.id = id ? id : null;
  }

  async save() {
    if (this.id) {
      const sql = `UPDATE meals 
        SET dish_id = ?, type_id = ?, date = ?, updated_at = now()
        WHERE id = ?`;
      const result = await query(sql, [this.dishId, this.typeId, this.date, this.id]);
      this.name = null;
      return this;
    } else {
      const sql = `INSERT INTO meals (dish_id, type_id, date, created_at, updated_at)
        VALUES ( ?, ?, ?, now(), now() )`;
      const result = await query(sql, [this.dishId, this.typeId, this.date]);
      this.id = result.insertId;
      return this;
    }
  }

  static async find(id = null) {
    if (id) {
      const sql = `SELECT meals.*, dishes.name 
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        WHERE meals.id = ? LIMIT 1`;
      const result = await query(sql, id);
      if(result[0]) {
        const meal = new Meal(result[0].id, result[0].dish_id, result[0].type_id, result[0].name, result[0].date);
        return meal;  
      }
      return false;
    } else {
      const sql = `SELECT meals.*, dishes.name
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        ORDER BY date DESC`;
      const result = await query(sql);
      const meals = [];
      result.forEach((element) => {
        meals.push(new Meal(element.id, element.dish_id, element.type_id, element.name, element.date));
      });
      return meals;
    }
  }

  static async delete(id) {
    if(id) {
      const sql = `DELETE FROM meals WHERE id = ?`;
      const result = await query(sql, id);
      return result.affectedRows;
    } else {
      throw 'Error: Id fail';
    }
  }
}

module.exports = Meal;
