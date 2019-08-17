/**
 * Route for user-related purposes.
 * Parent route: /user
 */

const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const UserController = require( '../controllers/user' );
const RecipeController = require( '../controllers/recipe' );

router.post( '/allergies', checkAuthentication, UserController.setAllergies );
router.put( '/allergies', checkAuthentication, UserController.addAllergy );
router.delete( '/allergies', checkAuthentication, UserController.deleteAllergy );
router.post( '/lifestyle', checkAuthentication, UserController.setLifestyle );
router.post( '/goal', checkAuthentication, UserController.setGoal );
router.post( '/dislikes', checkAuthentication, UserController.setDislikes );
router.put( '/dislikes', checkAuthentication, UserController.addDislike );
router.delete( '/dislikes', checkAuthentication, UserController.deleteDislike );
router.post( '/locale', checkAuthentication, UserController.setLocale );
router.get( '/me', checkAuthentication, UserController.me );
router.put( '/level', checkAuthentication, UserController.setLevel );

router.post( '/recipes', checkAuthentication, RecipeController.insertPersonalizedRecipe );
router.get( '/recipes', checkAuthentication, RecipeController.getRecipesOfUser );
router.get( '/recipes/:id', checkAuthentication, RecipeController.getSingleRecipeOfUser );
router.put( '/recipes', checkAuthentication, RecipeController.updatePersonalizedRecipe );
router.put( '/recipes/substitute', checkAuthentication, RecipeController.substituteIngredient );
router.delete( '/recipes/substitute', checkAuthentication, RecipeController.revertSubstitution );

module.exports = router;
