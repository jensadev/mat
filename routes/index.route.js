const express = require('express');
const router = express.Router();
const { verify } = require('../middlewares/verify');




/* GET home page. */
router.get('/jwt-test', verify, async (req, res) => {
  res.status(200).json(req.user);
});

// router.get('/', (req, res, next) => {

// });

module.exports = router;
