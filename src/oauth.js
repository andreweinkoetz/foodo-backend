/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const lodash = require( 'lodash' );
const bcrypt = require( 'bcrypt' );

const UserModel = require( './models/user' );
const ClientModel = require( './models/client' );
const TokenModel = require( './models/token' );
const CodeModel = require( './models/code' );

const convertTokenAlexa = async ( token ) => {
    console.log( 'Converting token for Alexa ...' );
    const alexaToken = lodash.cloneDeep( token );
    alexaToken.access_token = alexaToken.accessToken;
    // alexaToken.accessToken = undefined;
    alexaToken.refresh_token = alexaToken.refreshToken;
    // alexaToken.refreshToken = undefined;
    alexaToken.expires_in = token.accessTokenExpiresAt.getTime() - new Date().getTime();
    alexaToken.token_type = 'Bearer';
    return alexaToken;
};

const getUser = async ( username, password ) => {
    console.log( 'getUser-function called' );

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
    console.log( 'getClient-function called' );

    // Checks if there's a clientId with matching clientSecret.
    const client = await ClientModel.findOne( { clientId } ).exec();
    if ( clientSecret ) {
        return client && ( client.clientSecret === clientSecret ) ? client : undefined;
    }
    return client;
};

const saveToken = async ( token, client, user ) => {
    console.log( 'saveToken-function called' );

    const savingToken = lodash.cloneDeep( token );
    savingToken.user = user._id;
    savingToken.client = client._id;

    await TokenModel.create( savingToken );

    const returnToken = lodash.cloneDeep( token );
    returnToken.user = user;
    returnToken.client = client;

    if ( client.clientId === 'alexa' ) {
        return convertTokenAlexa( returnToken );
    }

    return returnToken;
};

const getAccessToken = async ( accessToken ) => {
    console.log( 'getAccessToken called' );

    const token = await TokenModel.findOne( { accessToken } ).populate( 'user' ).populate( 'client' ).exec();

    token.user.password = undefined;

    return token;
};

const getAuthorizationCode = async ( authorizationCode ) => {
    console.log( 'getAuthorizationCode called' );

    const code = await CodeModel.findOne( { authorizationCode } ).populate( 'client' ).exec();

    return code;
};

const saveAuthorizationCode = async ( code, client, user ) => {
    console.log( 'saveAuthorizationCode called' );

    const savingCode = lodash.cloneDeep( code );
    savingCode.client = client._id;
    savingCode.user = user._id;

    CodeModel.create( savingCode );

    return code;
};

const getRefreshToken = async ( refreshToken ) => {
    console.log( 'getRefreshToken called' );

    // Check if this refresh token exists.
    const token = await TokenModel.findOne( { refreshToken } ).populate( 'user' ).populate( 'client' ).exec();

    return ( new Date() > token.refreshTokenExpiresAt ) ? undefined : token;
};

const revokeAuthorizationCode = async ( code ) => {
    console.log( 'revokeAuthorizationCode called' );

    const removedCode = await CodeModel
        .findOneAndDelete( { authorizationCode: code.authorizationCode } )
        .exec();

    return !!removedCode;
};

const revokeToken = async ( token ) => {
    console.log( 'RevokeToken called' );

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
