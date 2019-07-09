const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const CookingSchema = new Schema( {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    persRecipe: {
        type: Schema.Types.ObjectId,
        ref: 'PersonalizedRecipe',
    },
    possibleSubstitution: {
        original: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
        substitutes: [ {
            substitute: {
                type: Schema.Types.ObjectId,
                ref: 'Ingredient',
            },
            amount: {
                type: Number,
                required: true,
            },
        } ],
    },
}, { collection: 'cooking' } );

CookingSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Cooking', CookingSchema );
