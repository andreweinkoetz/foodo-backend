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

// SECTION: Misc.
if ( !process.env.IS_PROD ) {
    dotenv.config();
}

mongoose.set( 'useCreateIndex', true );

// SECTION: route config
app.get( '/', ( req, res ) => res.send( 'Foodo backend received HTTP GET method' ) );
app.use( '/auth', auth );
app.use( '/recipe', recipes );
app.use( '/ingredient', ingredients );
app.use( '/user', user );
app.use( '', profile );

mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true } ).then( () => {
    // Initialize cache
    cache.initCache().then( () => {
        // Start server
        app.listen( process.env.PORT,
            () => console.log( `${ new Date() }: Express backend listening on port ${ process.env.PORT }!` ) );
    } );
} );
