/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const lodash = require( 'lodash' );
const bcrypt = require( 'bcrypt' );

const UserModel = require( './models/user' );
const ClientModel = require( './models/client' );
const TokenModel = require( './models/token' );
const config = require( './config' );

const getUser = ( username, password ) => {
    console.log( 'getUser-function called' );

    return UserModel.findOne( { username } ).then( ( user ) => {
        if ( user ) {
            if ( bcrypt.compareSync( password, user.password ) ) {
                return user;
            }
        }
        return undefined;
    } );
};

const getClient = ( clientId, clientSecret ) => {
    console.log( 'getClient-function called' );
    // TODO: Check clientId and secret
    return config.clients[ 0 ];
};

const saveToken = ( token, client, user ) => {
    console.log( 'saveToken-function called' );

    const savingToken = lodash.cloneDeep( token );

    TokenModel.create( savingToken ).then( ( savedToken ) => {
        UserModel.findOne( { username: user.username } )
            .then( u => u._id )
            .then( ( userId ) => {
                ClientModel.findOne( { id: client.id } ).then( ( c ) => {
                    /* eslint-disable-next-line no-param-reassign */
                    savedToken.user = user._id;
                    /* eslint-disable-next-line no-param-reassign */
                    savedToken.client = client._id;
                    savedToken.save();
                } );
            } );
    } );

    savingToken.user = user;
    savingToken.client = client;

    config.tokens.push( savingToken );
    return savingToken;
};

const getAccessToken = ( token ) => {
    console.log( 'getAccessToken called' );

    const tokens = config.tokens.filter( savedToken => savedToken.accessToken === token );

    return tokens[ 0 ];
};

const getRefreshToken = ( refreshToken ) => {
    console.log( 'getRefreshToken called' );
    // TODO: recap
    const tokens = config.tokens.filter( savedToken => savedToken.refreshToken === refreshToken );

    if ( !tokens.length ) {
        return undefined;
    }

    return tokens[ 0 ];
};

const revokeToken = ( token ) => {
    // TODO: recap
    config.tokens = config.tokens
        .filter( savedToken => savedToken.refreshToken !== token.refreshToken );

    const revokedTokensFound = config.tokens
        .filter( savedToken => savedToken.refreshToken === token.refreshToken );

    return !revokedTokensFound.length;
};


module.exports = {
    getUser,
    getClient,
    saveToken,
    getAccessToken,
    getRefreshToken,
    revokeToken,
};
