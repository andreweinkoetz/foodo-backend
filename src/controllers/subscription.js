const logger = require( '../logger' ).getLogger( 'SubscriptionController' );
// const SubscriptionModel = require( '../models/subscription' );
// const UserModel = require( '../models/user' );

const createSubscription = ( req, res ) => {
    logger.silly( 'Body' );
    logger.silly( JSON.stringify( req.body ) );
    res.status( 200 ).json( { msg: 'nice' } );
};

const cancelSubscription = ( req, res ) => {
    logger.silly( 'Body' );
    logger.silly( JSON.stringify( req.body ) );
    res.status( 200 ).json( { msg: 'nice' } );
};

module.exports = {
    createSubscription,
    cancelSubscription,
};
