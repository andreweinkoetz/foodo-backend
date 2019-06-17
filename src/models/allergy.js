const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const AllergySchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'allergy' } );

AllergySchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Allergy', AllergySchema );
