const express = require('express');
const router = express.Router();
const controller = require('../controllers/meals.controller');
const { body, param } = require('express-validator');
const { verify } = require('../middlewares/verify');

router
  .route('/')
  .get(controller.index)
  .post(
    body('dish_id').isInt(),
    body('type_id').isInt(),
    body('date').isDate().optional({nullable: true}),
    verify,
    controller.store);
router
  .route('/:id')
  .get(
    param('id').isInt(),
    controller.show)
  .put(
    param('id').isInt(),
    body('dish_id').isInt().optional({nullable: true}),
    body('type_id').isInt().optional({nullable: true}),
    body('date').isDate().optional({nullable: true}),
    verify,
    controller.update)
  .delete(
    param('id').isInt(),
    verify,
    controller.destroy);
// router
//   .route('/:id/edit')
//   .get(controller.edit);

module.exports = router;
