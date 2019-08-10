/**
 * AuthController
 * handles all auth related request of api.
 */
const bcrypt = require( 'bcrypt' );
const CACHE = require( './utilities/cache' );

// using oauth2 methods from middleware
const { obtainToken, authorize } = require( '../middlewares' );
const {
    missingProperties,
    sendBadRequestErrorMissingProperty,
    sendBadRequestErrorUsernameTaken,
} = require( './utilities/error' );
const UserModel = require( '../models/user' );

/**
 * Function to change password of user.
 * @param req
 * @param res
 * @returns {Promise<Promise|*|PromiseLike<T>|Promise<T>>}
 */
const changePassword = async ( req, res ) => {
    const { password, userId } = req.body;
    const hashedPassword = bcrypt.hashSync( password, 8 );
    return UserModel
        .findByIdAndUpdate( { _id: userId }, { password: hashedPassword } )
        .then( () => res.status( 200 ).json( { msg: 'Password updated successfully' } ) );
};

/**
 * Function to register a new user.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const register = async ( req, res ) => {
    const { body } = req;
    const { user } = body;
    const lifestyle = CACHE.getLifeStylesLocally().find( l => l.name === 'None' );

    const missingProp = missingProperties( user, [ 'username', 'password', 'locale' ] );
    if ( missingProp ) {
        return sendBadRequestErrorMissingProperty( res, missingProp );
    }
    const { username, password, locale } = user;
    const hashedPassword = bcrypt.hashSync( password, 8 );

    const existingUser = await UserModel.findOne( { username } ).exec();
    if ( existingUser ) return sendBadRequestErrorUsernameTaken( res, username );

    const registeringUser = {
        id: username,
        username,
        locale,
        password: hashedPassword,
        lifestyle: lifestyle._id,
    };
    return UserModel.create( registeringUser )
        .then( savedUser => res.status( 200 ).json( savedUser ) );
};

module.exports = {
    obtainToken,
    authorize,
    register,
    changePassword,
};
