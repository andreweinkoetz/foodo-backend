/**
 * IngredientController
 * handles all requests related to ingredients
 */

/* eslint-disable no-restricted-syntax,guard-for-in,no-param-reassign */
const IngredientModel = require( '../models/ingredient' );
const logger = require( '../logger' ).getLogger( 'ingredient_controller' );

// Only used by data-import batch script
const insertIngredientBatch = ( ingredientBatch ) => {
    console.log( `Inserting # ${ ingredientBatch.length } items` );
    return IngredientModel.insertMany( ingredientBatch );
};

/**
 * Returns all ingredients in db.
 * @param req
 * @param res
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
const getAllIngredients = ( req, res ) => IngredientModel
    .find( {} )
    .populate( 'category' )
    .then( ingredients => res.status( 200 ).json( ingredients ) );

/**
 * Returns a single ingredient identified by id.
 * @param req
 * @param res
 */
const getIngredientById = ( req, res ) => {
    IngredientModel.findById( { _id: req.params.id } )
        .populate( 'category' )
        .then( ingredient => res.status( 200 ).json( ingredient ) );
};

/**
 * Returns ingredients identified by category.
 * @param req
 * @param res
 */
const getIngredientsByCategory = ( req, res ) => {
    IngredientModel.find( { category: req.params.id } )
        .populate( 'category' )
        .then( ingredient => res.status( 200 ).json( ingredient ) );
};

/**
 * Returns ingredients which do not have a category associated.
 * @param req
 * @param res
 */
const getIngredientsWithoutCategories = ( req, res ) => {
    IngredientModel.find( { category: { $exists: 0 } } )
        .then( ingredients => res.status( 200 ).json( ingredients ) )
        .catch( err => logger.error( err ) );
};

/**
 * Updates the amount to match values resp. 100g
 * @param req
 * @param res
 */
const changeIngredientValues = ( req, res ) => {
    const { id } = req.body;
    const { amount } = req.body;

    IngredientModel.findById( { _id: id } )
        .populate( 'category' )
        .then( ( ingredient ) => {
            for ( const element in ingredient.elements ) {
                ingredient.elements[ element ] *= amount;
            }
            ingredient.save();
            res.status( 200 ).json( { message: 'Successfully updated ingredient' } );
        } ).catch( () => res.status( 400 ).json( { message: 'You entered a wrong id!' } ) );
};

/**
 * Sets/Updates the category of an ingredient.
 * @param req
 * @param res
 */
const setCategoryOfIngredient = ( req, res ) => {
    IngredientModel.findById( { _id: req.body._id } )
        .populate( 'category' )
        .then( ( ingredient ) => {
            ingredient.category = req.body.categoryId;
            ingredient.save();
            return res.status( 200 ).json( { msg: 'success' } );
        } );
};

/**
 * Sets/Updates allergies of an ingredient.
 * @param req
 * @param res
 */
const setAllergiesOfIngredient = ( req, res ) => {
    IngredientModel.findById( { _id: req.body._id } )
        .populate( 'notForAllergies' )
        .then( ( ingredient ) => {
            ingredient.notForAllergies = req.body.notForAllergies;
            ingredient.save();
            return res.status( 200 ).json( { msg: 'success' } );
        } );
};

/**
 * Sets/Updates lifestyles of an ingredient.
 * @param req
 * @param res
 */
const setLifestylesOfIngredient = ( req, res ) => {
    IngredientModel.findById( { _id: req.body._id } )
        .populate( 'notForLifestyles' )
        .then( ( ingredient ) => {
            ingredient.notForLifestyles = req.body.notForLifestyles;
            ingredient.save();
            return res.status( 200 ).json( { msg: 'success' } );
        } );
};

module.exports = {
    insertIngredientBatch,
    getAllIngredients,
    getIngredientById,
    getIngredientsByCategory,
    changeIngredientValues,
    setCategoryOfIngredient,
    getIngredientsWithoutCategories,
    setAllergiesOfIngredient,
    setLifestylesOfIngredient,
};
