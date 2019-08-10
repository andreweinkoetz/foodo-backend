/**
 * CategoryModel
 * builds the category db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for categories
 * @type {*|Mongoose.Schema}
 */
const CategorySchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'category' } );

CategorySchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Category', CategorySchema );
