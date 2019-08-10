/**
 * SubscriptionModel
 * builds the subscription db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for subscriptions
 * used for PayPal integration
 * @type {*|Mongoose.Schema}
 */
const SubscriptionSchema = new Schema( {
    paypalSubscriptionId: { // created by PayPal
        type: String,
        required: true,
    },
    paypalPlanId: { // defined in PayPal account
        type: String,
        required: true,
    },
    active: { // if sub. is (in)active
        type: Boolean,
        required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // ref. to user of sub.
}, { collection: 'subscription' } );

SubscriptionSchema.set( 'versionKey', false );
SubscriptionSchema.set( 'timestamps', true );

module.exports = mongoose.model( 'Subscription', SubscriptionSchema );
