const express = require('express');
const Dish = require('../models/dish.model');
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    console.log(req.query.search)
    try {
      const result = await Dish.find(req.query.search);
      if (result) {
        res.status(200).json({ dishes: result });
      } else {
        res.status(400);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
});

router
  .route('/:search')
  .get(async (req, res, next) => {
    console.log(req)
    try {
      const result = await Dish.find(req.params.search);
      if (result) {
        res.status(200).json({ dishes: result });
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
});

module.exports = router;