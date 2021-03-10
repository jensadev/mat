const { query } = require('./db.model');
// const dish = require('./dish.model');

class Meal {
  constructor(id, dish_id, type_id, user_id, dish = null, type = null, date = null) {
    if (!dish_id || !type_id || !user_id ) throw new Error('Property required');
    this.dish = dish;
    this.type = type;
    this.dishId = dish_id;
    this.typeId = type_id;
    this.userId = user_id;
    this.date = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    console.log(this.date)
    this.id = id;
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
      const sql = `INSERT INTO meals
        (dish_id, type_id, user_id, date, created_at, updated_at)
        VALUES ( ?, ?, ?, ?, now(), now() )`;
      const result = await query(sql, [this.dishId, this.typeId, this.userId, this.date]);
      if (result.insertId) {
        this.id = result.insertId;
        return this;
      }
    }
  }

  static async find(id = null, user = null) {
    if (id) {
      const sql = `SELECT meals.*, dishes.name AS dish, mealtypes.name AS type
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        JOIN mealtypes
        ON meals.type_id = mealtypes.id
        WHERE meals.id = ?
        LIMIT 1`;
      const result = await query(sql, id);
      if(result[0]) {
        const meal = new Meal(
          result[0].id,
          result[0].dish_id,
          result[0].type_id,
          result[0].user_id,
          result[0].dish,
          result[0].type,
          result[0].date
        );
        return meal;  
      }
      return false;
    } else {
      let result;
      if (user) {
        const sql = `SELECT meals.*, dishes.name AS dish, mealtypes.name AS type
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        JOIN mealtypes
        ON meals.type_id = mealtypes.id
        WHERE meals.user_id = ?
        ORDER BY date DESC, id DESC`;
        result = await query(sql, [user]);
      } else {
        const sql = `SELECT meals.*, dishes.name AS dish, mealtypes.name AS type
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        JOIN mealtypes
        ON meals.type_id = mealtypes.id
        ORDER BY date DESC, id DESC`;
        result = await query(sql);
      }
      const meals = [];
      result.forEach((element) => {
        meals.push(
          new Meal(
            element.id,
            element.dish_id,
            element.type_id,
            element.user_id,
            element.dish,
            element.type,
            element.date
          )
        );
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
