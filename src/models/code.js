const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const CodeSchema = new Schema( {
    authorizationCode: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    redirectUri: {
        type: String,
        required: true,
    },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { collection: 'code' } );

CodeSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Code', CodeSchema );
