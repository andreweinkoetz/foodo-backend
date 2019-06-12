const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const ClientSchema = new Schema( {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    clientId: {
        type: String,
        required: true,
        unique: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    grants: {
        type: [ String ],
        required: true,
    },
    redirectUris: {
        type: [ String ],
    },
}, { collection: 'client' } );

ClientSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Client', ClientSchema );
