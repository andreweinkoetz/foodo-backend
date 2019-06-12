const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const UserSchema = new Schema( {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'user' } );

UserSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'User', UserSchema );
