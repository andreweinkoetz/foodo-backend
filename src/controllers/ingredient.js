/* eslint-disable no-restricted-syntax,guard-for-in,no-param-reassign */
const IngredientModel = require( '../models/ingredient' );
const logger = require( '../logger' ).getLogger( 'ingredient_controller' );

const insertIngredientBatch = ( ingredientBatch ) => {
    console.log( `Inserting # ${ ingredientBatch.length } items` );
    return IngredientModel.insertMany( ingredientBatch );
};

const getAllIngredients = ( req, res ) => IngredientModel
    .find( {} )
    .populate( 'category' )
    .then( ingredients => res.status( 200 ).json( ingredients ) );

const getIngredientById = ( req, res ) => {
    IngredientModel.findById( { _id: req.params.id } )
        .populate( 'category' )
        .then( ingredient => res.status( 200 ).json( ingredient ) );
};

const getIngredientsByCategory = ( req, res ) => {
    IngredientModel.find( { category: req.params.id } )
        .populate( 'category' )
        .then( ingredient => res.status( 200 ).json( ingredient ) );
};
const getIngredientsWithoutCategories = ( req, res ) => {
    IngredientModel.find( { category: { $exists: 0 } } )
        .then( ingredients => res.status( 200 ).json( ingredients ) )
        .catch( err => logger.error( err ) );
};

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

const setCategoryOfIngredient = ( req, res ) => {
    IngredientModel.findById( { _id: req.body._id } )
        .populate( 'category' )
        .then( ( ingredient ) => {
            ingredient.category = req.body.categoryId;
            ingredient.save();
            return res.status( 200 ).json( { msg: 'success' } );
        } );
};

const setAllergiesOfIngredient = ( req, res ) => {
    IngredientModel.findById( { _id: req.body._id } )
        .populate( 'notForAllergy' )
        .then( ( ingredient ) => {
            ingredient.notForAllergy = req.body.notForAllergy;
            ingredient.save();
            return res.status( 200 ).json( { msg: 'success' } );
        } );
};

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
