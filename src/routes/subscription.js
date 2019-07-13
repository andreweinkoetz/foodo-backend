const express = require( 'express' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

const SubscriptionController = require( '../controllers/subscription' );

router.get( '/create', SubscriptionController.createSubscription );
router.get( '/cancel', SubscriptionController.cancelSubscription );

module.exports = router;
