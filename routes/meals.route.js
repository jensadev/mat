const express = require('express');
const router = express.Router();
const controller = require('../controllers/meals.controller');
const { body, param } = require('express-validator');
const { verify } = require('../middlewares/verify');

router
  .route('/')
  .get(controller.index)
  .post(
    body('dish_id').toInt(),
    body('type_id').toInt(),
    body('date').toDate(),
    verify,
    controller.store);
router
  .route('/:id')
  .get(
    param('id').isInt(),
    controller.show)
  .put(
    param('id').isInt(),
    body('dish_id').toInt(),
    body('type_id').toInt(),
    body('date').toDate(),
    verify,
    controller.update)
  .delete(
    param('id').toInt(),
    verify,
    controller.destroy);
// router
//   .route('/:id/edit')
//   .get(controller.edit);

module.exports = router;
