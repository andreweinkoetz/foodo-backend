/**
 * PersonalizedRecipeModel
 * builds the persRecipe db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for personalized recipes.
 * A recipe is transformed into a personalized recipe once a user selects it.
 * Used to keep track of the personal preferences and progress of a user.
 * @type {*|Mongoose.Schema}
 */
const PersonalizedRecipeSchema = new Schema( {
    user: { // ref. to user
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    client: { // ref. to client (via which app was it created)
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    personalizedRecipe: {
        origRecipe: { // ref. to standard recipe.
            type: Schema.Types.ObjectId,
            ref: 'Recipe',
        },
        ingredients: [ { // CURRENT ingredients in this recipe
            ingredient: { // subsitute ingredient
                type: Schema.Types.ObjectId,
                ref: 'Ingredient',
            },
            substitutionFor: { // ref. to ingredient in standard recipe
                type: Schema.Types.ObjectId,
                ref: 'Substitution',
            },
            amount: {
                type: Number,
                required: true,
            },
        } ],
        blockedSubstitutions: [ // original ingredients which shall not be replaced.
            {
                type: Schema.Types.ObjectId,
                ref: 'Ingredient',
            },
        ],

    },
}, { collection: 'personalizedRecipe' } );

PersonalizedRecipeSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'PersonalizedRecipe', PersonalizedRecipeSchema );
