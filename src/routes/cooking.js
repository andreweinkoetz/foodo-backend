const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const CookingController = require( '../controllers/cooking' );

router.get( '/start', checkAuthentication, CookingController.startCooking );
router.get( '/substitute', checkAuthentication, CookingController.substituteOriginal );
router.get( '/block', checkAuthentication, CookingController.blockSubstitution );

module.exports = router;
