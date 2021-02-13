const express = require('express');
const router = express.Router();
const { query } = require('../models/Database');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const sql = 'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, now(), now());';
    const result = await query(sql, ['this.name', 'this.email', 'this.password']);
    res.json({result});
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
