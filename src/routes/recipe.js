const express = require( 'express' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

const RecipesController = require( '../controllers/recipe' );

router.get( '/', RecipesController.getAllRecipes );

module.exports = router;
