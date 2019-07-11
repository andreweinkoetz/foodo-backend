const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const RecipeSchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
    preparationTime: {
        type: Number,
        required: true,
    },
    meal: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: [ 'Easy', 'Medium', 'Difficult' ],
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
    directions: {
        type: [ String ],
    },
    servings: [
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
    imgUrl: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png',
    },
}, { collection: 'recipe' } );

RecipeSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Recipe', RecipeSchema );
