const GoalModel = require( '../../models/goal' );
const LifestyleModel = require( '../../models/lifestyle' );
const AllergyModel = require( '../../models/allergy' );
const CategoryModel = require( '../../models/allergy' );

const CACHE = {};

const initCache = async () => {
    CACHE.GOALS = await GoalModel.find().exec();
    CACHE.ALLERGIES = await AllergyModel.find().exec();
    CACHE.CATEGORIES = await CategoryModel.find().exec();
    CACHE.LIFESTYLES = await LifestyleModel.find().exec();
};

const getGoals = ( req, res ) => res.status( 200 ).json( CACHE.GOALS );
const getAllergies = ( req, res ) => res.status( 200 ).json( CACHE.ALLERGIES );
const getCategories = ( req, res ) => res.status( 200 ).json( CACHE.CATEGORIES );
const getLifestyles = ( req, res ) => res.status( 200 ).json( CACHE.LIFESTYLES );

module.exports = {
    initCache,
    getGoals,
    getLifestyles,
    getAllergies,
    getCategories,
};
