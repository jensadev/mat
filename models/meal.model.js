const { query } = require('./db.model');
// const dish = require('./dish.model');

class Meal {
  constructor(id, dish_id, type_id, dish, type, date) {
    this.dish = dish ? dish : null;
    this.type = type ? type : null;
    this.dishId = dish_id ? dish_id : null;
    this.typeId = type_id;
    this.date = date ? date : new Date().toISOString().split('T')[0];
    this.id = id ? id : null;
  }

  async save() {
    if (this.id) {
      const sql = `UPDATE meals 
        SET dish_id = ?, type_id = ?, date = ?, updated_at = now()
        WHERE id = ?`;
      const result = await query(sql, [this.dishId, this.typeId, this.date, this.id]);
      this.dish = null;
      this.type = null;
      if (result.affectedRows) return this;
    } else {
      const sql = `INSERT INTO meals (dish_id, type_id, date, created_at, updated_at)
        VALUES ( ?, ?, ?, now(), now() )`;
      const result = await query(sql, [this.dishId, this.typeId, this.date]);
      if (result.insertId) {
        this.id = result.insertId;
        return this;
      }
    }
  }

  static async find(id = null) {
    if (id) {
      const sql = `SELECT meals.*, dishes.name AS dish, mealtypes.name AS type
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        JOIN mealtypes
        ON meals.type_id = mealtypes.id
        WHERE meals.id = ? LIMIT 1`;
      const result = await query(sql, id);
      if(result[0]) {
        const meal = new Meal(result[0].id, result[0].dish_id, result[0].type_id, result[0].dish, result[0].type, result[0].date);
        return meal;  
      }
      return false;
    } else {
      const sql = `SELECT meals.*, dishes.name AS dish, mealtypes.name AS type
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        JOIN mealtypes
        ON meals.type_id = mealtypes.id
        ORDER BY date DESC`;
      const result = await query(sql);
      const meals = [];
      result.forEach((element) => {
        meals.push(new Meal(element.id, element.dish_id, element.type_id, element.dish, element.type, element.date));
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
