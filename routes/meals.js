const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { authByToken } = require('../middleware/auth');

const MealsController = require('../controllers/meals');

// router.get('/', checkJwt, MealsController.index);
router.post(
  '/',
  body('meal.dish').not().isEmpty().trim().escape(),
  body('meal.typeId').isInt(),
  body('meal.date').isISO8601(),
  authByToken,
  MealsController.store
);

router.patch(
  '/',
  body('meal.id').isInt(),
  body('meal.dish').not().isEmpty().trim().escape(),
  body('meal.typeId').isInt(),
  body('meal.date').isISO8601(),
  authByToken,
  MealsController.update
);

// router.get('/', M.getAllArticles)                    //Get most recent articles from users you follow
// router.get('/feed',authByToken,ArticleController.getFeed)           //Get most recent articles globally
// router.post('/',authByToken,ArticleController.createArticle)        //Create an article
// router.get('/:slug',ArticleController.getSingleArticleBySlug)       //Get an article
// router.patch('/:slug',authByToken,ArticleController.updateArticle)  //Update an article
router.delete(
  '/:id',
  param('id').isInt(),
  authByToken,
  MealsController.destroy
);

module.exports = router;
