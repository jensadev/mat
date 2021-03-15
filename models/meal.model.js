const { query } = require('./db.model');
// const dish = require('./dish.model');

class Meal {
  constructor(id, dish_id, type_id, user_id, dish = null, type = null, date = null) {
    if (!dish_id || !type_id || !user_id ) {
      throw new Error(`Property required: ${dish_id}, ${type_id}, ${user_id}`);
    }
    this.dish = dish;
    this.type = type;
    this.dishId = dish_id;
    this.typeId = type_id;
    this.userId = user_id;
    this.date = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
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
    let result;
    if (id) {
      const sql = `SELECT meals.*, dishes.name AS dish, mealtypes.name AS type
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        JOIN mealtypes
        ON meals.type_id = mealtypes.id
        WHERE meals.id = ?
        LIMIT 1`;
      result = await query(sql, id);
    } else {
      if (user) {
        const sql = `SELECT meals.*, dishes.name AS dish, mealtypes.name AS type
        FROM meals 
        JOIN dishes
        ON meals.dish_id = dishes.id
        JOIN mealtypes
        ON meals.type_id = mealtypes.id
        WHERE meals.user_id = ?
        ORDER BY date DESC, type_id DESC`;
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
    }
    if (result.length > 0) {
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
    return false;
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
