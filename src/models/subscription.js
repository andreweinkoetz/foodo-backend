const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const SubscriptionSchema = new Schema( {
    paypalSubscriptionId: {
        type: String,
        required: true,
    },
    paypalPlanId: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { collection: 'Subscription' } );

SubscriptionSchema.set( 'versionKey', false );
SubscriptionSchema.set( 'timestamps', true );

module.exports = mongoose.model( 'Subscription', SubscriptionSchema );
