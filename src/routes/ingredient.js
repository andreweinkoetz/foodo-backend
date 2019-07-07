const express = require( 'express' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

const IngredientsController = require( '../controllers/ingredient' );

router.get( '/', IngredientsController.getAllIngredients );
router.get( '/:id', IngredientsController.getIngredientById );
router.get( '/tmp/categories', IngredientsController.getIngredientsWithoutCategories );
router.get( '/categories/:id', IngredientsController.getIngredientsByCategory );
router.post( '/changevalue', IngredientsController.changeIngredientValues );
router.post( '/setcategory', IngredientsController.setCategoryOfIngredient );
router.post( '/setallergies', IngredientsController.setAllergiesOfIngredient );

module.exports = router;
