const express = require( 'express' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

const RecipesController = require( '../controllers/recipe' );

router.get( '/', RecipesController.getAllRecipes );
router.post( '/', RecipesController.insertRecipe );

module.exports = router;
