const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const TokenSchema = new Schema( {
    accessToken: {
        type: String,
        required: true,
        unique: true,
    },
    accessTokenExpiresAt: {
        type: Date,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    refreshTokenExpiresAt: {
        type: Date,
        required: true,
    },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { collection: 'token' } );

TokenSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Token', TokenSchema );
