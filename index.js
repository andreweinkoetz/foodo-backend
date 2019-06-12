/* eslint-disable no-console */
const dotenv = require( 'dotenv' );
const mongoose = require( 'mongoose' );
const { app } = require( './src/middlewares' );
const auth = require( './src/routes/auth' );

// SECTION: Misc.
if ( !process.env.IS_PROD ) {
    dotenv.config();
}

mongoose.set( 'useCreateIndex', true );

// SECTION: route config
app.get( '/', ( req, res ) => res.send( 'Received a GET HTTP method' ) );
app.use( '/auth', auth );

mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true } ).then( () => {
// Start server
    app.listen( process.env.PORT, () => console.log( `${ new Date() }: Express backend listening on port ${ process.env.PORT }!` ) );
} );
