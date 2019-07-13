const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );

const SubscriptionController = require( '../controllers/subscription' );

router.post( '/create', SubscriptionController.createSubscription );
router.post( '/cancel', SubscriptionController.cancelSubscription );
router.put( '/subscribe', checkAuthentication, SubscriptionController.subscribeUser );

module.exports = router;
