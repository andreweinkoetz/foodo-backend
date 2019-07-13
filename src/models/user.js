const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const UserSchema = new Schema( {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    locale: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
        enum: [ 'free', 'subscribed', 'admin' ],
        default: 'free',
    },
    allergies: [ { type: Schema.Types.ObjectId, ref: 'Allergy' } ],
    lifestyle: { type: Schema.Types.ObjectId, ref: 'Lifestyle' },
    dislikes: [ { type: Schema.Types.ObjectId, ref: 'Ingredient' } ],
    goal: { type: Schema.Types.ObjectId, ref: 'Goal' },
}, { collection: 'user' } );

UserSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'User', UserSchema );
