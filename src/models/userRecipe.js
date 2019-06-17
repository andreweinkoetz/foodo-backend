const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const UserRecipeSchema = new Schema( {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    recipe: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Recipe',
        },
        substitutions: [ {
            orig: {
                type: Schema.Types.ObjectId,
                ref: 'Ingredient',
            },
            subs: [ {
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Ingredient',
                },
                rating: {
                    type: Schema.Types.Boolean,
                    ref: 'Recipe',
                },
            } ],
        } ],

    },

}, { collection: 'userRecipe' } );

UserRecipeSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'User', UserRecipeSchema );
