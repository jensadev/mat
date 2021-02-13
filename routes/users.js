const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');

router
  .route('/')
  .get(controller.index)
  // .post(controller.store);
router
  .route('/:id')
  .get(controller.show)
  // .post(controller.update)
  // .delete(controller.destroy);
// router
//   .route('/:id/edit')
//   .get(controller.edit);

module.exports = router;
