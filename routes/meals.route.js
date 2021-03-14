const express = require('express');
const router = express.Router();
const controller = require('../controllers/meals.controller');
const { body } = require('express-validator');
const { checkJwt } = require('../middlewares/checkJwt');

router
  .route('/')
  .post(
    body('dish').trim().escape().optional({nullable: true}),
    body('dish_id').isInt().optional({nullable: true}),
    body('type_id').isInt(),
    body('date').isISO8601( ).optional({nullable: true}),
    checkJwt,
    controller.store);
// router
//   .route('/:id')
//   .get(
//     param('id').isInt(),
//     controller.show)
//   .put(
//     param('id').isInt(),
//     body('dish_id').isInt().optional({nullable: true}),
//     body('type_id').isInt().optional({nullable: true}),
//     body('date').isISO8601( ).optional({nullable: true}),
//     checkJwt,
//     controller.update)
//   .delete(
//     param('id').isInt(),
//     checkJwt,
//     controller.destroy);
// router
//   .route('/:id/edit')
//   .get(controller.edit);

module.exports = router;
