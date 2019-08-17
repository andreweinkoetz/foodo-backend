/**
 * Route for recipe-related purposes.
 * Parent route: /recipe
 */

const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const RecipesController = require( '../controllers/recipe' );

router.get( '/', RecipesController.getAllRecipes );
router.get( '/:id', RecipesController.getRecipeById );
router.post( '/', RecipesController.insertRecipe );
router.get( '/:id/substitutes', checkAuthentication, RecipesController.getSubstitutions );
router.put( '/:id/blocksubstitute', checkAuthentication, RecipesController.blockSubstitution );

module.exports = router;
