const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const UserController = require( '../controllers/user' );

router.post( '/:id/allergies', UserController.setAllergies );
router.post( '/:id/lifestyle', UserController.setLifestyle );
router.post( '/:id/goal', UserController.setGoal );
router.post( '/:id/dislikes', UserController.setDislikes );
router.post( '/:id/locale', UserController.setLocale );
router.get( '/me', checkAuthentication, UserController.me );

router.put( '/recipe', UserController.updatePersonalizedRecipe );
router.post( '/recipe', UserController.insertPersonalizedRecipe );
router.get( '/recipe', UserController.getRecipesOfUser );
router.get( '/recipe/:id', UserController.getSingleRecipeOfUser );

module.exports = router;
