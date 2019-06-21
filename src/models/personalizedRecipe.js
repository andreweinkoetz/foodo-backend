const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const PersonalizedRecipeSchema = new Schema( {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    personalizedRecipe: {
        origRecipe: {
            type: Schema.Types.ObjectId,
            ref: 'Recipe',
        },
        ingredients: [ {
            ingredient: {
                type: Schema.Types.ObjectId,
                ref: 'Ingredient',
            },
            amount: {
                type: Number,
                required: true,
            },
        } ],
        blockedSubstitutions: [ {
            orig: {
                type: Schema.Types.ObjectId,
                ref: 'Ingredient',
            },
            blockedSubs: [ { type: Schema.Types.ObjectId, ref: 'Ingredient' } ],
        } ],

    },
}, { collection: 'personalizedRecipe' } );

PersonalizedRecipeSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'PersonalizedRecipe', PersonalizedRecipeSchema );
