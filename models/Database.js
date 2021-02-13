const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

function query (sql, ...params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, function (err, result, fields) {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports = { pool, query };