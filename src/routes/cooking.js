const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const CookingController = require( '../controllers/cooking' );

router.post( '/start', checkAuthentication, CookingController.startCooking );
router.get( '/substitute/:selectedNumber', checkAuthentication, CookingController.substituteOriginal );
router.get( '/block', checkAuthentication, CookingController.blockSubstitution );

module.exports = router;
