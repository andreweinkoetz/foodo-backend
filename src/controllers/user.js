const lodash = require( 'lodash' );
const UserModel = require( '../models/user' );
const PersonalizedRecipeModel = require( '../models/personalizedRecipe' );
const TokenModel = require( '../models/token' );

const setGoal = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.params.id }, { goal: req.body.goal }, { new: true } )
    .then( user => res.status( 200 ).json( user ) );

const setLifestyle = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.params.id }, { lifestyle: req.body.lifestyle }, { new: true } )
    .then( user => res.status( 200 ).json( user ) );

const setDislikes = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.params.id }, { dislikes: req.body.dislikes }, { new: true } )
    .then( user => res.status( 200 ).json( user ) );

const setAllergies = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.params.id }, { allergies: req.body.allergies }, { new: true } )
    .then( user => res.status( 200 ).json( user ) );

const setLocale = ( req, res ) => UserModel
    .findByIdAndUpdate( { _id: req.params.id }, { locale: req.body.allergies }, { new: true } )
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
        .then( token => res.status( 200 ).json( token.user ) );
};

const updatePersonalizedRecipe = ( req, res ) => {
    const updateRecipe = lodash.cloneDeep( req.body.recipe );
    return PersonalizedRecipeModel
        .findByIdAndUpdate( { _id: req.params.id }, updateRecipe, { new: true } )
        .then( persRecipe => res.status( 200 ).json( persRecipe ) );
};

const insertPersonalizedRecipe = ( req, res ) => {
    const insertRecipe = lodash.cloneDeep( req.body.recipe );
    return PersonalizedRecipeModel
        .create( insertRecipe )
        .then( persRecipe => res.status( 200 ).json( persRecipe ) );
};

const getRecipesOfUser = ( req, res ) => PersonalizedRecipeModel
    .find( { user: req.params.id } )
    .populate( 'origRecipe' )
    .populate( 'ingredients' )
    // .populate( { path: 'blockedSubstitutions', populate: { path: 'orig' } } )
    // .populate( { path: 'blockedSubstitutions', populate: { path: 'blockedSubs' } } )
    // disabled due to performance improvement ->
    // if we need this we should check which populations do make sense
    .then( personalizedRecipe => res.status( 200 ).json( personalizedRecipe ) );

const getSingleRecipeOfUser = ( req, res ) => PersonalizedRecipeModel
    .findById( { _id: req.params.id } )
    .populate( 'origRecipe' )
    .populate( 'ingredients' )
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
    updatePersonalizedRecipe,
    insertPersonalizedRecipe,
    getRecipesOfUser,
    getSingleRecipeOfUser,

};
