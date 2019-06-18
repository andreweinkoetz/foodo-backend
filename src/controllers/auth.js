const bcrypt = require( 'bcrypt' );

const { obtainToken, authorize } = require( '../middlewares' );
const {
    missingProperties,
    sendBadRequestErrorMissingProperty,
    sendBadRequestErrorUsernameTaken,
} = require( './utilities/error' );
const UserModel = require( '../models/user' );

const changePassword = async ( req, res ) => {
    const { password, userId } = req.body;
    const hashedPassword = bcrypt.hashSync( password, 8 );
    return UserModel
        .findByIdAndUpdate( { _id: userId }, { password: hashedPassword } )
        .then( () => res.status( 200 ).json( { msg: 'Password updated successfully' } ) );
};

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

module.exports = {
    obtainToken,
    authorize,
    register,
    changePassword,
};
