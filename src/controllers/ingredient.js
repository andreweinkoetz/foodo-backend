/* eslint-disable no-restricted-syntax,guard-for-in,no-param-reassign */
const IngredientModel = require( '../models/ingredient' );

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

const getIngredientsByGroup = ( req, res ) => {
    IngredientModel.find( { foodGroup: req.params.group } )
        .then( ingredient => res.status( 200 ).json( ingredient ) );
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

module.exports = {
    insertIngredientBatch,
    getAllIngredients,
    getIngredientById,
    getIngredientsByGroup,
    changeIngredientValues,
};
