/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const lodash = require( 'lodash' );
const bcrypt = require( 'bcrypt' );

const UserModel = require( './models/user' );
const ClientModel = require( './models/client' );
const TokenModel = require( './models/token' );
const CodeModel = require( './models/code' );

const logger = require( './logger' ).getLogger( 'oauth' );

const convertTokenAlexa = async ( token ) => {
    logger.debug( 'Converting token for Alexa ...' );
    const alexaToken = lodash.cloneDeep( token );
    alexaToken.access_token = alexaToken.accessToken;
    // alexaToken.accessToken = undefined;
    alexaToken.refresh_token = alexaToken.refreshToken;
    // alexaToken.refreshToken = undefined;
    alexaToken.expires_in = token.accessTokenExpiresAt.getTime() - new Date().getTime();
    alexaToken.token_type = 'Bearer';

    logger.debug( `Alexa-Token: ${ alexaToken }` );

    return alexaToken;
};

const getUser = async ( username, password ) => {
    logger.debug( 'getUser-function called' );

    const user = await UserModel
        .findOne( { username } )
        .populate( 'dislikes' )
        .populate( 'goal' )
        .populate( 'lifestyle' )
        .populate( 'allergies' )
        .exec();
    const validPassword = user && bcrypt.compareSync( password, user.password );
    user.password = undefined;
    return validPassword ? user : undefined;
};

const getClient = async ( clientId, clientSecret ) => {
    logger.debug( 'getClient-function called' );
    logger.debug( ` Used clientId: ${ clientId }` );
    // Checks if there's a clientId with matching clientSecret.
    const client = await ClientModel.findOne( { clientId } ).exec();
    if ( clientSecret ) {
        return client && ( client.clientSecret === clientSecret ) ? client : undefined;
    }
    return client;
};

const saveToken = async ( token, client, user ) => {
    logger.debug( 'saveToken-function called' );

    const savingToken = lodash.cloneDeep( token );
    savingToken.user = user._id;
    savingToken.client = client._id;

    // workaround for alexa tokens which do not reuqest refresh token
    if ( client.clientId === 'alexa' ) {
        savingToken.accessTokenExpiresAt
            .setFullYear( savingToken.accessTokenExpiresAt.getFullYear() + 1 );
        savingToken.refreshTokenExpiresAt
            .setFullYear( savingToken.refreshTokenExpiresAt.getFullYear() + 1 );
    }

    await TokenModel.create( savingToken );

    const returnToken = lodash.cloneDeep( token );
    returnToken.user = user;
    returnToken.client = client;

    logger.debug( `Token: ${ returnToken }` );

    if ( client.clientId === 'alexa' ) {
        return convertTokenAlexa( returnToken );
    }

    return returnToken;
};

const getAccessToken = async ( accessToken ) => {
    logger.debug( 'getAccessToken called' );
    logger.silly( `Token:${ JSON.stringify( accessToken ) }` );
    const token = await TokenModel.findOne( { accessToken } ).populate( 'user' ).populate( 'client' ).exec();

    token.user.password = undefined;

    return token;
};

const getAuthorizationCode = async ( authorizationCode ) => {
    logger.debug( 'getAuthorizationCode called' );

    const code = await CodeModel.findOne( { authorizationCode } ).populate( 'client' ).exec();

    return code;
};

const saveAuthorizationCode = async ( code, client, user ) => {
    logger.debug( 'saveAuthorizationCode called' );

    const savingCode = lodash.cloneDeep( code );
    savingCode.client = client._id;
    savingCode.user = user._id;

    CodeModel.create( savingCode );

    return code;
};

const getRefreshToken = async ( refreshToken ) => {
    logger.debug( 'getRefreshToken called' );

    // Check if this refresh token exists.
    const token = await TokenModel.findOne( { refreshToken } ).populate( 'user' ).populate( 'client' ).exec();

    return ( new Date() > token.refreshTokenExpiresAt ) ? undefined : token;
};

const revokeAuthorizationCode = async ( code ) => {
    logger.debug( 'revokeAuthorizationCode called' );

    const removedCode = await CodeModel
        .findOneAndDelete( { authorizationCode: code.authorizationCode } )
        .exec();

    return !!removedCode;
};

const revokeToken = async ( token ) => {
    logger.debug( 'RevokeToken called' );

    const removedToken = await TokenModel
        .findOneAndDelete( { refreshToken: token.refreshToken } ).exec();

    return !!removedToken;
};

module.exports = {
    getUser,
    getClient,
    saveToken,
    saveAuthorizationCode,
    getAccessToken,
    getRefreshToken,
    revokeToken,
    getAuthorizationCode,
    revokeAuthorizationCode,
};
