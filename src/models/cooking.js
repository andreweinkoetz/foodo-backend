/**
 * CookingModel
 * builds the cooking db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for cooking model.
 * Only used by Alexa skill.
 * @type {*|Mongoose.Schema}
 */
const CookingSchema = new Schema( {
    user: { // user that started cooking process
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    persRecipe: { // ref. to the users recipe.
        type: Schema.Types.ObjectId,
        ref: 'PersonalizedRecipe',
    },
    possibleSubstitution: { // calculated substitutes for unhealthy ingredient
        original: { type: Schema.Types.ObjectId, ref: 'Ingredient' }, // unhealthy ingredient
        substitutes: [ { // array of possible substitutes (best 3)
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
