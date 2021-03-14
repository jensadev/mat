const express = require('express');
const router = express.Router();
// const Dish = require('../models/dish.model');

// const { body, query, validationResult } = require('express-validator');
// const { verify } = require('../middlewares/verify');

// router
//   .route('/')
//   .get(
//     query('search').trim().escape(),
//     async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.table(errors.array())
//       return res.status(400).json({ errors: errors.array() });
//     }
  
//     try {
//       const result = await Dish.find(req.query.search);
//       if (result) {
//         res.status(200).json({ dishes: result });
//       } else {
//         res.status(400);
//       }
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
// })
// .post(
//   body('name').trim().escape(),
//   verify,
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.table(errors.array())
//       return res.status(400).json({ errors: errors.array() });
//     }
//     console.log(req.body);
//   });


// router
//   .route('/:search')
//   .get(async (req, res, next) => {
//     console.log(req)
//     try {
//       const result = await Dish.find(req.params.search);
//       if (result) {
//         res.status(200).json({ dishes: result });
//       }
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
// });

module.exports = router;