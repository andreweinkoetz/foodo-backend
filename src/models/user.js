/**
 * UserModel
 * builds the user db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for users.
 * @type {*|Mongoose.Schema}
 */
const UserSchema = new Schema( {
    id: { // unique identifier
        type: String,
        required: true,
        unique: true,
    },
    username: { // unique username (equal to id)
        type: String,
        required: true,
        unique: true,
    },
    password: { // password of user
        type: String,
        required: true,
        unique: true,
    },
    locale: { // locale of user (en/de)
        type: String,
        required: true,
    },
    level: { // user level: administrative or subscription-related
        type: String,
        required: true,
        enum: [ 'free', 'subscribed', 'admin' ],
        default: 'free',
    },
    allergies: [ { type: Schema.Types.ObjectId, ref: 'Allergy' } ], // user allergies
    lifestyle: { type: Schema.Types.ObjectId, ref: 'Lifestyle' }, // user lifestyle
    dislikes: [ { type: Schema.Types.ObjectId, ref: 'Ingredient' } ], // user dislikes
    goal: { type: Schema.Types.ObjectId, ref: 'Goal' },
}, { collection: 'user' } );

UserSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'User', UserSchema );
