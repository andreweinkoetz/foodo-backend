const UserModel = require( '../models/user' );
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

module.exports = {
    setGoal,
    setLifestyle,
    setDislikes,
    setAllergies,
    setLocale,
    me,
};
