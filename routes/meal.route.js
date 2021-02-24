const express = require('express');
const router = express.Router();
const controller = require('../controllers/meal.controller');
const { body, validationResult  } = require('express-validator');

router
  .route('/')
  .get(controller.index)
  .post(
    body('name').not().isEmpty().trim().escape(),
    body('type_id').toInt(),
    body('date').toDate(),
    controller.store);
router
  .route('/:id')
  .get(controller.show)
  .put(controller.update)
  .delete(controller.destroy);
// router
//   .route('/:id/edit')
//   .get(controller.edit);

module.exports = router;
