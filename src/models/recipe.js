/**
 * RecipeModel
 * builds the standard recipe db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for a standard recipe.
 * Standard recipes are created by administrative users.
 * *For future work: Let users create their own recipes.*
 * @type {*|Mongoose.Schema}
 */
const RecipeSchema = new Schema( {
    name: { // name of recipe
        type: String,
        required: true,
        unique: true,
    },
    preparationTime: { // prep. time in minutes
        type: Number,
        required: true,
    },
    meal: { // e.g. lunch, breakfast, etc.
        type: String,
        required: true,
    },
    difficulty: { // how difficult it is to cook this dish.
        type: String,
        enum: [ 'Easy', 'Medium', 'Difficult' ],
    },
    ingredients: [ { // which ingredients are part of this recipe.
        ingredient: {
            type: Schema.Types.ObjectId,
            ref: 'Ingredient',
        },
        amount: {
            type: Number,
            required: true,
        },
    } ],
    directions: { // textual description of how to cook this recipe.
        type: [ String ],
    },
    servings: [ // serving sizes of recipe.
        {
            name: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        } ],
    imgUrl: { // image of recipe (stock)
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png',
    },
}, { collection: 'recipe' } );

RecipeSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Recipe', RecipeSchema );
