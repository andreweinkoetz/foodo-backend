const GoalModel = require( '../../models/goal' );
const LifestyleModel = require( '../../models/lifestyle' );
const AllergyModel = require( '../../models/allergy' );
const CategoryModel = require( '../../models/category' );
const logger = require( '../../logger' ).getLogger( 'CACHE' );

const CACHE = {};

const initCache = async () => {
    logger.debug( 'Initializing Cache...' );
    CACHE.GOALS = await GoalModel.find().exec();
    CACHE.ALLERGIES = await AllergyModel.find().exec();
    CACHE.CATEGORIES = await CategoryModel.find().exec();
    CACHE.LIFESTYLES = await LifestyleModel.find().exec();
    logger.debug( 'Cache initialized!' );
    logger.debug( '### GOALS ### ' );
    logger.debug( CACHE.GOALS );
    logger.debug( '### ALLERGIES ### ' );
    logger.debug( CACHE.ALLERGIES );
    logger.debug( '### CATEGORIES ### ' );
    logger.debug( CACHE.CATEGORIES );
    logger.debug( '### LIFESTYLES ### ' );
    logger.debug( CACHE.LIFESTYLES );
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
