/* eslint-disable no-console */
const dotenv = require( 'dotenv' );
const mongoose = require( 'mongoose' );
const { app } = require( './src/middlewares' );
const config = require( './src/config' );
const auth = require( './src/routes/auth' );
const TokenModel = require( './src/models/token' );
const ClientModel = require( './src/models/client' );


// SECTION: Misc.
dotenv.config();
mongoose.set( 'useCreateIndex', true );

// SECTION: route config
app.get( '/', ( req, res ) => res.send( 'Received a GET HTTP method' ) );
app.use( '/auth', auth );

mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true } ).then( () => {
    TokenModel.find().populate( 'user' ).populate( 'client' ).then( ( tokens ) => { config.tokens = tokens; } )
        .then( () => {
            ClientModel.find().then( ( clients ) => { config.clients = clients; } ).then( () => {
            // Start server
                app.listen( process.env.PORT, () => console.log( `Express backend listening on port ${ process.env.PORT }!` ) );
            } );
        } );
} );
