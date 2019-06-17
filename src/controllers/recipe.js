const lodash = require( 'lodash' );
const RecipeModel = require( '../models/recipe' );

const getAllRecipes = ( req, res ) => RecipeModel
    .find( {} ).populate( 'ingredients' ).then( recipes => res.status( 200 ).json( recipes ) );

const insertRecipe = ( req, res ) => {
    const newRecipe = lodash.cloneDeep( req.body.recipe );
    RecipeModel.create( newRecipe ).then( recipe => res.status( 200 ).json( recipe ) );
};

module.exports = {
    getAllRecipes,
    insertRecipe,
};
