const { query, pool } = require('./db.model');
const dish = require('./dish.model');

class Meal {
  constructor(id, dish_id, name, type, date = new Date().toISOString().split('T')[0]) {
    this.name = name ? name : null;
    this.dishId = dish_id ? dish_id : null;
    this.typeId = type;
    this.date = date;
    this.id = id ? id : null;
  }

  // async setDish(nam) {
  //   let dish = 
  // }

  async save() {
    if (this.id) {
      try {
        const sql = `UPDATE meals 
          SET name = ?, type_id = ?, date = ?, updated_at = now()
          WHERE id = ?`;
        const result = await query(sql, [this.name, this.typeId, this.date, this.id]);
        return this;
      } catch (e) {
        console.error(e);
        return false;
      }
    } else {
      try {
        const sql = `INSERT INTO meals (name, type_id, date, created_at, updated_at)
          VALUES ( ?, ?, ?, now(), now() )`;
        const result = await query(sql, [this.name, this.typeId, this.date]);
        this.id = result.insertId;
        return this;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }

  static async find(id = null) {
    if (id) {
      try {
        const sql = `SELECT * FROM meals WHERE id = ? LIMIT 1`;
        const result = await query(sql, id);
        if(result[0]) {
          const meal = new Meal(result[0].id, result[0].name, result[0].type_id, result[0].date);
          return meal;  
        }
        return false;
      } catch (e) {
        console.error(e);
        return false;
      }
    } else {
      try {
        const sql = `SELECT * FROM meals ORDER BY date DESC`;
        const result = await query(sql);
        const meals = [];
        result.forEach((element) => {
          meals.push(new Meal(element.id, element.name, element.type_id, element.date));
        });
        return meals;
      } catch (e) {
        console.error(e);
      }
    }
  }

  static async delete(id) {
    if(id) {
      try {
        const sql = `DELETE FROM meals WHERE id = ?`;
        const result = await query(sql, id);
        return result.affectedRows;
      } catch (e) {
        console.error(e);
        return 0;
      }
    } else {
      throw 'Error: Id fail';
    }
  }
}

module.exports = Meal;
