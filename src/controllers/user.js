const lodash = require( 'lodash' );
const UserModel = require( '../models/user' );
const PersonalizedRecipeModel = require( '../models/personalizedRecipe' );
const TokenModel = require( '../models/token' );

const setGoal = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { goal: req.body.goal }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

const setLifestyle = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { lifestyle: req.body.lifestyle }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

const addDislike = ( req, res ) => UserModel
    .findById( { _id: req.body.userId } )
    .populate( 'dislikes' )
    .then( ( user ) => {
        user.dislikes.push( req.body.dislike );
        user.save();
        return res.status( 200 ).json( { msg: 'Successfully added dislike' } );
    } );

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

const setDislikes = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { dislikes: req.body.dislikes }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

const setAllergies = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { allergies: req.body.allergies }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

const addAllergy = ( req, res ) => UserModel
    .findById( { _id: req.body.userId } )
    .populate( 'allergies' )
    .then( ( user ) => {
        user.allergies.push( req.body.allergy );
        user.save();
        return res.status( 200 ).json( { msg: 'Successfully added allergy' } );
    } );

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

const setLocale = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.body.userId }, { locale: req.body.locale }, { new: true } )
    .select( '-password' )
    .then( user => res.status( 200 ).json( user ) );

const me = ( req, res ) => {
    const { accessToken } = req.body.token.token;

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

const insertPersonalizedRecipe = ( req, res ) => {
    const personalizedRecipe = {
        user: req.body.userId,
        client: req.body.clientId,
        personalizedRecipe: req.body.personalizedRecipe,
    };
    PersonalizedRecipeModel
        .create( personalizedRecipe )
        .then( persRecipe => res.status( 200 ).json( persRecipe ) );
};

const getRecipesOfUser = ( req, res ) => {
    PersonalizedRecipeModel
        .find( { user: req.body.userId } )
        .populate( 'origRecipe' )
        .populate( 'ingredients' )
        .populate( 'client' )
        .then( personalizedRecipe => res.status( 200 ).json( personalizedRecipe ) );
};

const getSingleRecipeOfUser = ( req, res ) => PersonalizedRecipeModel
    .findById( { _id: req.params.id } )
    .populate( 'origRecipe' )
    .populate( 'ingredients' )
    .populate( 'client' )
    .populate( { path: 'blockedSubstitutions', populate: { path: 'orig' } } )
    .populate( { path: 'blockedSubstitutions', populate: { path: 'blockedSubs' } } )
    .then( personalizedRecipe => res.status( 200 ).json( personalizedRecipe ) );

module.exports = {
    setGoal,
    setLifestyle,
    setDislikes,
    setAllergies,
    setLocale,
    me,
    insertPersonalizedRecipe,
    getRecipesOfUser,
    getSingleRecipeOfUser,
    addDislike,
    addAllergy,
    deleteAllergy,
    deleteDislike,
};
