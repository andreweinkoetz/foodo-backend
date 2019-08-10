/**
 * SubscriptionController
 * handles all requests regarding the PayPal subscription process.
 */
const logger = require( '../logger' ).getLogger( 'SubscriptionController' );
const SubscriptionModel = require( '../models/subscription' );
const UserModel = require( '../models/user' );

/**
 * Create own subscription document in db.
 * @param req
 * @param res
 */
const createSubscription = ( req, res ) => {
    logger.debug( 'Subscription create process started.' );

    const { plan_id: planId, id } = req.body.resource;

    SubscriptionModel.create( {
        paypalSubscriptionId: id,
        paypalPlanId: planId,
        active: true,
    } );

    res.status( 200 ).json( { msg: 'nice' } );
};

/**
 * Activate the subscription of a user.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const subscribeUser = async ( req, res ) => {
    logger.debug( 'Subscription add user process started.' );
    const { subscriptionId, userId } = req.body;
    const subscription = await SubscriptionModel
        .findOneAndUpdate( { paypalSubscriptionId: subscriptionId, active: true },
            { user: userId }, { new: true } ).exec();

    if ( !subscription ) {
        return res.sendStatus( 404 );
    }

    UserModel.findOneAndUpdate( { _id: userId }, { level: 'subscribed' } ).exec();
    return res.sendStatus( 200 );
};

/**
 * Deactivate the subscription of a user.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const cancelSubscription = async ( req, res ) => {
    logger.debug( 'Subscription cancel process started.' );
    const paypalSubscriptionId = req.body.resource.id;
    const subscription = await SubscriptionModel
        .findOneAndRemove( { paypalSubscriptionId } ).exec();
    UserModel.findOneAndUpdate( { _id: subscription.user }, { level: 'free' } ).exec();
    res.sendStatus( 200 );
};

module.exports = {
    createSubscription,
    cancelSubscription,
    subscribeUser,
};
