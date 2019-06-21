/* eslint-disable no-restricted-syntax,guard-for-in,no-param-reassign */
const IngredientModel = require( '../models/ingredient' );
const CategoryModel = require( '../models/category' );

const insertIngredientBatch = ( ingredientBatch ) => {
    console.log( `Inserting # ${ ingredientBatch.length } items` );
    return IngredientModel.insertMany( ingredientBatch );
};

const getAllIngredients = ( req, res ) => IngredientModel
    .find( {} ).then( ingredients => res.status( 200 ).json( ingredients ) );

const getIngredientById = ( req, res ) => {
    IngredientModel.findById( { _id: req.params.id } )
        .then( ingredient => res.status( 200 ).json( ingredient ) );
};

const getIngredientsByCategory = ( req, res ) => {
    IngredientModel.find( { category: req.params.id } )
        .then( ingredient => res.status( 200 ).json( ingredient ) );
};
const getIngredientsWithoutCategories = ( req, res ) => {
    IngredientModel.find( { category: { $exists: false } } )
        .then( ingredients => res.status( 200 ).json( ingredients ) );
};

const changeIngredientValues = ( req, res ) => {
    const { id } = req.body;
    const { amount } = req.body;

    IngredientModel.findById( { _id: id } ).then( ( ingredient ) => {
        for ( const element in ingredient.elements ) {
            ingredient.elements[ element ] *= amount;
        }
        ingredient.save();
        res.status( 200 ).json( { message: 'Successfully updated ingredient' } );
    } ).catch( () => res.status( 400 ).json( { message: 'You entered a wrong id!' } ) );
};

const setCategoryOfIngredient = ( req, res ) => {
    IngredientModel.findById( { _id: req.body.id } )
        .then( ( ingredient ) => {
            ingredient.category = req.body.id;
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
};
