const bcrypt = require( 'bcrypt' );

const { obtainToken, authorize } = require( '../middlewares' );
const {
    missingProperties,
    sendBadRequestErrorMissingProperty,
    sendBadRequestErrorUsernameTaken,
} = require( './utilities/error' );
const UserModel = require( '../models/user' );
const TokenModel = require( '../models/token' );


const register = async ( req, res ) => {
    const { body } = req;
    const missingProp = missingProperties( body, [ 'username', 'password' ] );
    if ( missingProp ) {
        return sendBadRequestErrorMissingProperty( res, missingProp );
    }
    const { username, password } = body;
    const hashedPassword = bcrypt.hashSync( password, 8 );

    const existingUser = await UserModel.findOne( { username } ).exec();
    if ( existingUser ) return sendBadRequestErrorUsernameTaken( res, username );

    const registeringUser = {
        id: username,
        username,
        password: hashedPassword,
    };
    return UserModel.create( registeringUser )
        .then( user => res.status( 200 ).json( user ) );
};

const me = ( req, res ) => {
    const { accessToken } = req.body.token.token;

    return TokenModel
        .findOne( { accessToken } ).populate( 'user' )
        .then( token => res.status( 200 ).json( token.user ) );
};

module.exports = {
    obtainToken,
    authorize,
    register,
    me,
};
