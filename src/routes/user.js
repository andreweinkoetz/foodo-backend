const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const UserController = require( '../controllers/user' );

router.post( '/allergies', checkAuthentication, UserController.setAllergies );
router.put( '/allergy', checkAuthentication, UserController.addAllergy );
router.delete( '/allergy', checkAuthentication, UserController.deleteAllergy );
router.post( '/lifestyle', checkAuthentication, UserController.setLifestyle );
router.post( '/goal', checkAuthentication, UserController.setGoal );
router.post( '/dislikes', checkAuthentication, UserController.setDislikes );
router.put( '/dislike', checkAuthentication, UserController.addDislike );
router.delete( '/dislike', checkAuthentication, UserController.deleteDislike );
router.post( '/locale', checkAuthentication, UserController.setLocale );
router.get( '/me', checkAuthentication, UserController.me );

router.put( '/recipe', checkAuthentication, UserController.updatePersonalizedRecipe );
router.post( '/recipe', checkAuthentication, UserController.insertPersonalizedRecipe );
router.get( '/recipe', checkAuthentication, UserController.getRecipesOfUser );
router.get( '/recipe/:id', checkAuthentication, UserController.getSingleRecipeOfUser );

module.exports = router;
