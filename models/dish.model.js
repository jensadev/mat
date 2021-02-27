const e = require('express');
const { query } = require('./db.model');

class Dish {
  constructor(id, name, userId) {
    if (!name || !userId) throw new Error('Property required');
    this.name = name;
    this.userId = userId;
    this.id = id ? id : null;
  }

  static async search(name = null) {
    if (name) {
      const sql = 'SELECT * FROM dishes WHERE name LIKE ?';
      const result = await query(sql, [name + '%']);
      if (result.length > 1) {
        const dishes = [];

        result.forEach(element => {
          dishes.push(new Dish(element.id, element.name, element.user_id));
        });

        return dishes;  
      } else {
        return result[0];
      }
    } else {
      return false;
    }
  }

  async save() {
    if (this.id) {
      const sql = 'UPDATE dishes SET name = ?, user_id = ?, updated at = now() where id = ?';
      const result = await query(sql, [this.name, this.userId]);
      console.table(result)
      return this;
    } else {
      const sql = `INSERT INTO dishes (name, user_id, created_at, updated_at) 
        VALUES ( ?, ?, now(), now() )`;
      const result = await query(sql, [this.name, this.userId]);
      this.id = result.insertId;
      return this;
    }
  }

  static async find(id = null) {
    // if (id) {
    //   try {
    //     const sql = `SELECT * FROM meals WHERE id = ? LIMIT 1`;
    //     const result = await query(sql, id);
    //     if(result[0]) {
    //       const meal = new Meal(result[0].id, result[0].name, result[0].type_id, result[0].date);
    //       return meal;  
    //     }
    //     return false;
    //   } catch (e) {
    //     console.error(e);
    //     return false;
    //   }
    // } else {
    //   try {
    //     const sql = `SELECT * FROM meals ORDER BY date DESC`;
    //     const result = await query(sql);
    //     const meals = [];
    //     result.forEach((element) => {
    //       meals.push(new Meal(element.id, element.name, element.type_id, element.date));
    //     });
    //     return meals;
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  }

  static async delete(id) {
  //   if(id) {
  //     try {
  //       const sql = `DELETE FROM meals WHERE id = ?`;
  //       const result = await query(sql, id);
  //       return result.affectedRows;
  //     } catch (e) {
  //       console.error(e);
  //       return 0;
  //     }
  //   } else {
  //     throw 'Error: Id fail';
  //   }
  }
}

module.exports = Dish;
