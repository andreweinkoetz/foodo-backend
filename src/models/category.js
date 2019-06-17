const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const CategorySchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'category' } );

CategorySchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Category', CategorySchema );
