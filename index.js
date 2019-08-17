/**
 * ENTRY FILE FOR EXPRESS APP.
 * This file gets called when running "npm start" command.
 */

/* eslint-disable no-console */
const dotenv = require( 'dotenv' );
const mongoose = require( 'mongoose' );
const cache = require( './src/controllers/utilities/cache' );
const { app } = require( './src/middlewares' );
const auth = require( './src/routes/auth' );
const recipes = require( './src/routes/recipe' );
const ingredients = require( './src/routes/ingredient' );
const user = require( './src/routes/user' );
const profile = require( './src/routes/profile' );
const cooking = require( './src/routes/cooking' );
const subscription = require( './src/routes/subscription' );
const logger = require( './src/logger' ).getLogger( 'index' );

// SECTION: Misc.
if ( !process.env.IS_PROD ) {
    dotenv.config();
}

// SECTION: Config mongoose
mongoose.set( 'useCreateIndex', true );
mongoose.set( 'useFindAndModify', false );

// SECTION: route config
app.get( '/', ( req, res ) => res.send( 'Foodo backend received HTTP GET method' ) );
app.use( '/auth', auth );
app.use( '/recipes', recipes );
app.use( '/ingredients', ingredients );
app.use( '/user', user );
app.use( '/cooking', cooking );
app.use( '', profile );
app.use( '/subscription', subscription );

/**
 * Start of application
 * 1. open db connection
 * 2. initialize manual caching of large collections
 * 3. start web server process
 */
mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true } ).then( () => {
    // Initialize cache
    cache.initCache().then( () => {
        // Start server
        app.listen( process.env.PORT,
            () => logger.info( `Express backend listening on port ${ process.env.PORT }!` ) );
    } );
} );
