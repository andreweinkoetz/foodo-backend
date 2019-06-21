const express = require( 'express' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

const RecipesController = require( '../controllers/recipe' );

router.get( '/', RecipesController.getAllRecipes );
router.get( '/:id', RecipesController.getRecipeById );
router.post( '/', RecipesController.insertRecipe );
router.get( '/:id/substitutes', RecipesController.substituteIngredients );

module.exports = router;
