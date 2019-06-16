const RecipeModel = require( '../models/recipe' );

const getAllRecipes = ( req, res ) => RecipeModel
    .find( {} ).populate( 'ingredients' ).then( recipes => res.status( 200 ).json( recipes ) );

module.exports = {
    getAllRecipes,
};
