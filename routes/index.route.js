const express = require('express');
const router = express.Router();
const { query } = require('../models/db.model');
const { verify } = require('../middlewares/verify');

/* GET home page. */
router.get('/jwt-test', verify, async (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = router;
