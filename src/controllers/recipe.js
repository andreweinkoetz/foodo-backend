const lodash = require( 'lodash' );
const RecipeModel = require( '../models/recipe' );
const PersonalizedRecipeModel = require( '../models/personalizedRecipe' );
const substitutor = require( '../algorithm/substitutor' );

const getAllRecipes = ( req, res ) => RecipeModel
    .find( {} ).then( recipes => res.status( 200 ).json( recipes ) );

const getRecipeById = ( req, res ) => RecipeModel
    .findById( { _id: req.params.id } )
    .populate( { path: 'ingredients.ingredient' } )
    .then( recipe => res.status( 200 ).json( recipe ) );

const insertRecipe = ( req, res ) => {
    const newRecipe = lodash.cloneDeep( req.body.recipe );
    RecipeModel.create( newRecipe ).then( recipe => res.status( 200 ).json( recipe ) );
};

const substituteIngredients = ( req, res ) => {
    const persRecipeId = req.params.id;
    PersonalizedRecipeModel.findById( persRecipeId )
        .populate( 'user' )
        .populate( 'client' )
        .populate( 'personalizedRecipe.origRecipe' )
        .populate( 'personalizedRecipe.ingredients.ingredient' )
        .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
        .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
        .then( ( persRecipe ) => {
            const result = substitutor.calculateSubstitutions( persRecipe );
            res.status( 200 ).json( result );
        } );
};

const blockSubstitution = ( req, res ) => {
    const persRecipeId = req.params.id;
    const origIngredientId = req.body.origId;
    const subIngredient = req.body.subId;

    PersonalizedRecipeModel.findById( persRecipeId )
        .populate( 'personalizedRecipe.blockedSubstitutions' )
        .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
        .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
        .then( ( recipe ) => {
            const origIngredient = recipe.personalizedRecipe.blockedSubstitutions
                .find( entry => entry.orig._id === origIngredientId );
            if ( !origIngredient ) {
                recipe.personalizedRecipe.blockedSubstitutions.push( {
                    orig: origIngredientId,
                    blockedSubs: [ subIngredient ],
                } );
            } else {
                recipe.personalizedRecipe.blockedSubstitutions.blockedSubs.push( subIngredient );
            }
            recipe.save();
        } );
    return res.status( 200 ).json( { msg: 'success' } );
};

const getRecipesOfUser = ( req, res ) => {
    PersonalizedRecipeModel
        .find( { user: req.body.userId } )
        .populate( 'personalizedRecipe.origRecipe' )
        .populate( {
            path: 'personalizedRecipe.origRecipe',
            populate: {
                path: 'ingredients.ingredient',
                model: 'Ingredient',
                populate: {
                    path: 'category',
                    model: 'Category',
                },
            },
        } )
        .populate( {
            path: 'personalizedRecipe.ingredients.ingredient',
            populate: {
                path: 'category',
                model: 'Category',
            },
        } )
        .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
        .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
        .then( personalizedRecipe => res.status( 200 ).json( personalizedRecipe ) );
};

const getSingleRecipeOfUser = ( req, res ) => PersonalizedRecipeModel
    .findOne( { 'personalizedRecipe.origRecipe': req.params.id, user: req.body.userId } )
    .populate( 'personalizedRecipe.origRecipe' )
    .populate( {
        path: 'personalizedRecipe.origRecipe',
        populate: {
            path: 'ingredients.ingredient',
            model: 'Ingredient',
            populate: {
                path: 'category',
                model: 'Category',
            },
        },
    } )
    .populate( {
        path: 'personalizedRecipe.ingredients.ingredient',
        populate: {
            path: 'category',
            model: 'Category',
        },
    } )
    .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
    .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
    .then( personalizedRecipe => res.status( 200 ).json( personalizedRecipe ) );


const insertPersonalizedRecipe = ( req, res ) => {
    const personalizedRecipe = {
        user: req.body.userId,
        client: req.body.clientId,
        personalizedRecipe: req.body.personalizedRecipe,
    };
    PersonalizedRecipeModel
        .create( personalizedRecipe )
        .then( ( persRecipe ) => {
            PersonalizedRecipeModel.findById( persRecipe._id )
                .populate( 'personalizedRecipe.origRecipe' )
                .populate( {
                    path: 'personalizedRecipe.origRecipe',
                    populate: {
                        path: 'ingredients.ingredient',
                        model: 'Ingredient',
                        populate: {
                            path: 'category',
                            model: 'Category',
                        },
                    },
                } )
                .populate( {
                    path: 'personalizedRecipe.ingredients.ingredient',
                    populate: {
                        path: 'category',
                        model: 'Category',
                    },
                } )
                .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
                .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
                .then( popPersRecipe => res.status( 200 ).json( popPersRecipe ) );
        } );
};

const updatePersonalizedRecipe = ( req, res ) => {
    const client = req.body.clientId;
    const { personalizedRecipe } = req.body;
    PersonalizedRecipeModel.findOneAndUpdate( { _id: personalizedRecipe._id }, {
        $set: {
            ...personalizedRecipe,
            client,
        },
    }, { new: true } )
        .populate( 'personalizedRecipe.origRecipe' )
        .populate( {
            path: 'personalizedRecipe.origRecipe',
            populate: {
                path: 'ingredients.ingredient',
                model: 'Ingredient',
                populate: {
                    path: 'category',
                    model: 'Category',
                },
            },
        } )
        .populate( {
            path: 'personalizedRecipe.ingredients.ingredient',
            populate: {
                path: 'category',
                model: 'Category',
            },
        } )
        .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
        .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
        .then( popPersRecipe => res.status( 200 ).json( popPersRecipe ) );
};


module.exports = {
    getAllRecipes,
    getRecipeById,
    insertRecipe,
    substituteIngredients,
    blockSubstitution,
    getSingleRecipeOfUser,
    updatePersonalizedRecipe,
    getRecipesOfUser,
    insertPersonalizedRecipe,
};
