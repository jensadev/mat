const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { checkJwt } = require('../middleware/checkJwt');

const MealsController = require('../controllers/meals');

// router.get('/', checkJwt, MealsController.index);
router.post(
  '/',
  body('dish').trim().escape(),
  body('typeId').isInt(),
  body('date').isISO8601(),
  checkJwt,
  MealsController.store
);

router.patch(
  '/',
  body('id').isInt(),
  body('dish').trim().escape(),
  body('typeId').isInt(),
  body('date').isISO8601(),
  checkJwt,
  MealsController.update
);

// router.get('/', M.getAllArticles)                    //Get most recent articles from users you follow
// router.get('/feed',authByToken,ArticleController.getFeed)           //Get most recent articles globally
// router.post('/',authByToken,ArticleController.createArticle)        //Create an article
// router.get('/:slug',ArticleController.getSingleArticleBySlug)       //Get an article
// router.patch('/:slug',authByToken,ArticleController.updateArticle)  //Update an article
router.delete('/:id', param('id').isInt(), checkJwt, MealsController.destroy); //Delete resource

module.exports = router;
