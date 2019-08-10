/**
 * ClientModel
 * builds the client db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for clients.
 * Used to separate between alexa and react application within oauth2-process.
 * @type {*|Mongoose.Schema}
 */
const ClientSchema = new Schema( {
    id: { // unique identifier for client
        type: String,
        required: true,
        unique: true,
    },
    clientId: { // same as id for compatibility
        type: String,
        required: true,
        unique: true,
    },
    clientSecret: { // "password" for client
        type: String,
        required: true,
    },
    grants: { // grant types accepted for this client
        type: [ String ],
        required: true,
    },
    redirectUris: { // required by oauth2 process
        type: [ String ],
    },
}, { collection: 'client' } );

ClientSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Client', ClientSchema );
