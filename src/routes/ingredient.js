const express = require( 'express' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

const IngredientsController = require( '../controllers/ingredient' );

router.get( '/', IngredientsController.getAllIngredients );
router.get( '/:id', IngredientsController.getIngredientById );
router.get( '/groups/:id', IngredientsController.getIngredientsByGroup );
router.post( '/changevalue', IngredientsController.changeIngredientValues );

module.exports = router;
