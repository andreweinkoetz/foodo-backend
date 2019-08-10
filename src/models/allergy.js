/**
 * AllergyModel
 * builds the allergy db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for allergies
 * @type {*|Mongoose.Schema}
 */
const AllergySchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'allergy' } );

AllergySchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Allergy', AllergySchema );
