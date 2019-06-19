/**
 * Constants for usage in error message handling.
 */
const USER_NOT_FOUND = "Cannot set property 'password' of null";
const PASSWORD_WRONG = 'Invalid grant: user credentials are invalid';


/**
 * @param {object} body
 * @param {string} property
 * @returns {boolean}
 */
const missesProperty = ( body, property ) => !Object.prototype
    .hasOwnProperty.call( body, property );

/**
 * @param {object} body
 * @param {Array} property
 * @returns {boolean}
 */
const missingProperties = ( body, properties ) => {
    for ( let i = 0; i < properties.length; i += 1 ) {
        if ( missesProperty( body, properties[ i ] ) ) return properties[ i ];
    }
    return false;
};

/**
 * @param {object} res
 * @param {string} property
 * @returns {json}
 */
const sendBadRequestErrorMissingProperty = ( res, property ) => res.status( 400 )
    .json( {
        error: 'Bad Request',
        message: `The request body must contain a ${ property } property`,
    } );

/**
 * @param {object} res
 * @param {string} username
 * @returns {json}
 */
const sendBadRequestErrorUsernameTaken = ( res, username ) => res.status( 400 )
    .json( {
        error: 'Bad Request',
        message: `The ${ username } is already taken`,
    } );

const sendBadRequestPasswordEmpty = res => res.status( 404 )
    .json( {
        error: 'Bad Request',
        message: 'The password-field must be set.',
    } );

const generateAndSendErrorMessage = ( res, err ) => {
    if ( err.message === USER_NOT_FOUND ) {
        res.status( 404 ).json( {
            error: 'Bad Request',
            message: 'User does not exist.',
        } );
    }
    if ( err.message === PASSWORD_WRONG ) {
        res.status( 400 ).json( {
            error: 'Bad Request',
            message: 'Password wrong.',
        } );
    }
};

module.exports = {
    missesProperty,
    missingProperties,
    sendBadRequestErrorMissingProperty,
    sendBadRequestErrorUsernameTaken,
    sendBadRequestPasswordEmpty,
    generateAndSendErrorMessage,
};
