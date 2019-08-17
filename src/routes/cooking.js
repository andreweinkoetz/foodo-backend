/**
 * Route for cooking with Alexa.
 * Parent route: /cooking
 */

const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const CookingController = require( '../controllers/cooking' );

router.post( '/start', checkAuthentication, CookingController.startCooking );
router.get( '/substitutes', checkAuthentication, CookingController.getSubstitutes );
router.get( '/substitute/:selectedNumber', checkAuthentication, CookingController.substituteOriginal );
router.post( '/block', checkAuthentication, CookingController.blockSubstitution );
router.get( '/nutriscore', checkAuthentication, CookingController.calculateNutriScore );

module.exports = router;
