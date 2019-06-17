const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const PersonalizedRecipeSchema = new Schema( {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    personalizedRecipe: {
        origRecipe: {
            type: Schema.Types.ObjectId,
            ref: 'Recipe',
        },
        ingredients: [ { type: Schema.Types.ObjectId, ref: 'Ingredient' } ], // aktueller Stand
        blockedSubstitutions: [ {
            orig: {
                type: Schema.Types.ObjectId,
                ref: 'Ingredient',
            },
            blockedSubs: [ { type: Schema.Types.ObjectId, ref: 'Ingredient' } ],
        } ],

    },
}, { collection: 'userRecipe' } );

PersonalizedRecipeSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'User', PersonalizedRecipeSchema );
