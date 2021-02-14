const express = require('express');
const router = express.Router();
const { query } = require('../models/Database');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const sql = `UPDATE users SET name = ? WHERE id = ?`;
    const result = await query(sql, ['korv', 1]);
    res.json({result});
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
