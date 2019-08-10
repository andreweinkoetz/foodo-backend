/**
 * LifestyleModel
 * builds the lifestyles db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for lifestyles.
 * @type {*|Mongoose.Schema}
 */
const LifestyleSchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'lifestyle' } );

LifestyleSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Lifestyle', LifestyleSchema );
