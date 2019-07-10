/* eslint-disable no-param-reassign */
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const OAuth2Server = require( 'oauth2-server' );
const cors = require( 'cors' );
const oauthModel = require( './oauth' );
const error = require( './controllers/utilities/error' );
const logger = require( './logger' ).getLogger( 'MIDDLEWARE' );

const { Request, Response } = OAuth2Server;

const app = express();

// SECTION: Configure OAuth2
app.oauth = new OAuth2Server( {
    model: oauthModel,
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true,
} );

// SECTION: Configure supporting modules (middlewares) for express
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cors() );

// SECTION: OAuth functions
const obtainToken = ( req, res ) => {
    const request = new Request( req );
    const response = new Response( res );

    if ( req.body.password === null || req.body.password === '' ) {
        error.sendBadRequestPasswordEmpty( res );
    }

    return app.oauth.token( request, response )
        .then( ( token ) => {
            res.json( token );
        } ).catch( ( err ) => {
            error.generateAndSendErrorMessage( res, err );
        } );
};

const authorize = ( req, res ) => {
    const request = new Request( req );
    const response = new Response( res );
    return app.oauth.authorize( request, response ).then( ( token ) => {
        res.json( token );
    } ).catch( ( err ) => {
        res.status( err.code || 500 ).json( err );
    } );
};

const checkAuthentication = ( req, res, next ) => {
    logger.debug( `Checking authentication for token: ${ JSON.stringify( req.headers ) }` );

    const request = new Request( req );
    const response = new Response( res );

    return app.oauth.authenticate( request, response )
    // eslint-disable-next-line no-unused-vars
        .then( ( token ) => {
            req.body.token = {
                token,
            };
            req.body.userId = token.user._id;
            req.body.clientId = token.client._id;
            next();
        } ).catch( ( err ) => {
            res.status( err.code || 500 ).json( err );
        } );
};

module.exports = {
    app,
    authorize,
    obtainToken,
    checkAuthentication,
};
