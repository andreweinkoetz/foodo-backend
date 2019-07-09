const GoalModel = require( '../../models/goal' );
const LifestyleModel = require( '../../models/lifestyle' );
const AllergyModel = require( '../../models/allergy' );
const CategoryModel = require( '../../models/category' );
const IngredientModel = require( '../../models/ingredient' );
const logger = require( '../../logger' ).getLogger( 'CACHE' );

const CACHE = {};

const initCache = async () => {
    logger.debug( 'Initializing Cache...' );
    CACHE.GOALS = await GoalModel.find().exec();
    CACHE.ALLERGIES = await AllergyModel.find().exec();
    CACHE.CATEGORIES = await CategoryModel.find().exec();
    CACHE.LIFESTYLES = await LifestyleModel.find().exec();
    CACHE.INGREDIENT_BASE = await IngredientModel
        .find()
        .populate( 'category' )
        .populate( 'notForAllergy' )
        .populate( 'notForLifestyles' )
        .exec();
    logger.debug( 'Cache initialized!' );
    logger.debug( '### GOALS ### ' );
    logger.debug( CACHE.GOALS );
    logger.debug( '### ALLERGIES ### ' );
    logger.debug( CACHE.ALLERGIES );
    logger.debug( '### CATEGORIES ### ' );
    logger.debug( CACHE.CATEGORIES );
    logger.debug( '### LIFESTYLES ### ' );
    logger.debug( CACHE.LIFESTYLES );
    logger.debug( '### INGREDIENTS_BASE ### ' );
    logger.debug( `# of ingredients loaded: ${ CACHE.INGREDIENT_BASE.length }` );
};

const getGoals = ( req, res ) => res.status( 200 ).json( CACHE.GOALS );
const getAllergies = ( req, res ) => res.status( 200 ).json( CACHE.ALLERGIES );
const getCategories = ( req, res ) => res.status( 200 ).json( CACHE.CATEGORIES );
const getLifestyles = ( req, res ) => res.status( 200 ).json( CACHE.LIFESTYLES );
const getIngredientsBase = () => CACHE.INGREDIENT_BASE;
const getLifeStylesLocally = () => CACHE.LIFESTYLES;

module.exports = {
    getIngredientsBase,
    initCache,
    getGoals,
    getLifestyles,
    getAllergies,
    getCategories,
    getLifeStylesLocally,
};
