const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const UserController = require( '../controllers/user' );

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

router.post( '/recipes', checkAuthentication, UserController.insertPersonalizedRecipe );
router.get( '/recipes', checkAuthentication, UserController.getRecipesOfUser );
router.get( '/recipes/:id', checkAuthentication, UserController.getSingleRecipeOfUser );
router.put( '/recipes', checkAuthentication, UserController.updatePersonalizedRecipe );

module.exports = router;
