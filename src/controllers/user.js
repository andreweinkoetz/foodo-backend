/**
 * UserController
 * handles all user related requests.
 */

const UserModel = require( '../models/user' );
const TokenModel = require( '../models/token' );
const logger = require( '../logger' ).getLogger( 'UserController' );

/**
 * Sets the goal of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const setGoal = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { goal: req.body.goal }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

/**
 * Sets the level of a user
 * Levels can be either administrative or subscription-based.
 * Levels are defined in @models/user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const setLevel = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { level: req.body.level }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

/**
 * Set the lifestyle of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const setLifestyle = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { lifestyle: req.body.lifestyle }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

/**
 * Adds a dislike of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const addDislike = ( req, res ) => UserModel
    .findById( { _id: req.body.userId } )
    .populate( 'dislikes' )
    .then( ( user ) => {
        user.dislikes.push( req.body.dislike );
        user.save();
        return res.status( 200 ).json( { msg: 'Successfully added dislike' } );
    } );

/**
 * Removes a dislike of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const deleteDislike = ( req, res ) => UserModel
    .findById( { _id: req.body.userId } )
    .populate( 'dislikes' )
    .then( ( user ) => {
        const changeUser = user;
        changeUser.dislikes = user.dislikes
            .filter( dislike => dislike._id.toString() !== req.body.dislike._id );
        changeUser.save();
        return res.status( 200 ).json( { msg: 'Successfully removed dislike' } );
    } );

/**
 * Sets dislikes of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const setDislikes = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { dislikes: req.body.dislikes }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

/**
 * Sets allergies of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const setAllergies = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { allergies: req.body.allergies }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

/**
 * Adds an allergy of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const addAllergy = ( req, res ) => UserModel
    .findById( { _id: req.body.userId } )
    .populate( 'allergies' )
    .then( ( user ) => {
        user.allergies.push( req.body.allergy );
        user.save();
        return res.status( 200 ).json( { msg: 'Successfully added allergy' } );
    } );

/**
 * Removes an allergy of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const deleteAllergy = ( req, res ) => UserModel
    .findById( { _id: req.body.userId } )
    .populate( 'allergies' )
    .then( ( user ) => {
        const changeUser = user;
        changeUser.allergies = user.allergies
            .filter( allergy => allergy._id.toString() !== req.body.allergy._id );
        changeUser.save();
        return res.status( 200 ).json( { msg: 'Successfully removed allergy' } );
    } );

/**
 * Sets the locale of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const setLocale = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { locale: req.body.locale }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

/**
 * Returns all profile-based information of a user.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const me = ( req, res ) => {
    const { accessToken } = req.body.token.token;
    logger.silly( `Endpoint: /me called with token: ${ accessToken }` );
    return TokenModel
        .findOne( { accessToken } )
        .populate( 'user' )
        .populate( { path: 'user', populate: { path: 'dislikes' } } )
        .populate( { path: 'user', populate: { path: 'goal' } } )
        .populate( { path: 'user', populate: { path: 'lifestyle' } } )
        .populate( { path: 'user', populate: { path: 'allergies' } } )
        .select( '-password' )
        .then( token => res.status( 200 ).json( token.user ) );
};


module.exports = {
    setGoal,
    setLevel,
    setLifestyle,
    setDislikes,
    setAllergies,
    setLocale,
    me,
    addDislike,
    addAllergy,
    deleteAllergy,
    deleteDislike,
};
