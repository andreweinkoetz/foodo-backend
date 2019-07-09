/* eslint-disable no-param-reassign */
const _ = require( 'lodash' );
const RecipeModel = require( '../models/recipe' );
const PersonalizedRecipeModel = require( '../models/personalizedRecipe' );
const IngredientModel = require( '../models/ingredient' );
const SubstitutionModel = require( '../models/substitution' );
const substitutor = require( '../algorithm/substitutor' );

const getAllRecipes = ( req, res ) => RecipeModel
    .find( {} ).then( recipes => res.status( 200 ).json( recipes ) );

const getRecipeById = ( req, res ) => RecipeModel
    .findById( { _id: req.params.id } )
    .populate( { path: 'ingredients.ingredient' } )
    .then( recipe => res.status( 200 ).json( recipe ) );

const insertRecipe = ( req, res ) => {
    const newRecipe = _.cloneDeep( req.body.recipe );
    RecipeModel.create( newRecipe ).then( recipe => res.status( 200 ).json( recipe ) );
};

const getSubstitutions = ( req, res ) => {
    const persRecipeId = req.params.id;
    PersonalizedRecipeModel.findById( persRecipeId )
        .populate( 'user' )
        .populate( {
            path: 'user',
            populate: {
                path: 'allergies',
                model: 'Allergy',
            },
        } )
        .populate( {
            path: 'user',
            populate: {
                path: 'dislikes',
                model: 'Ingredient',
            },
        } )
        .populate( {
            path: 'user',
            populate: {
                path: 'goal',
                model: 'Goal',
            },
        } )
        .populate( {
            path: 'user',
            populate: {
                path: 'lifestyle',
                model: 'Lifestyle',
            },
        } )
        .populate( 'client' )
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

const checkDoubleIngredientEntries = ( persRecipe, substituteId ) => {
    const foundIngredient = persRecipe.personalizedRecipe.ingredients
        .find( ingredient => ingredient.ingredient._id.toString() === substituteId );
    return foundIngredient;
};

const revertSubstitution = ( req, res ) => {
    const { historyId } = req.body;
    SubstitutionModel.findById( historyId )
        .populate( 'original' )
        .populate( 'substitute' )
        .then( ( history ) => {
            PersonalizedRecipeModel.findById( history.persRecipe )
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
                .populate( {
                    path: 'personalizedRecipe.ingredients.ingredient',
                    populate: {
                        path: 'substitutionFor',
                        model: 'Substitution',
                    },
                } )
                .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
                .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
                .then( async ( persRecipe ) => {
                    const revertI = persRecipe.personalizedRecipe.ingredients
                        .find( i => i.substitutionFor
                        && i.substitutionFor._id.toString() === historyId );

                    const isInRecipe = persRecipe.personalizedRecipe.ingredients
                        .find( i => i.ingredient
                            ._id.toString() === history.original._id.toString() );

                    if ( isInRecipe ) {
                        isInRecipe.amount += revertI.amount;
                    } else {
                        // we need it populated for the frontend
                        const inserted = await IngredientModel.findById( history.original._id );
                        persRecipe.personalizedRecipe.ingredients
                            .push( { amount: history.amount, ingredient: inserted } );
                    }

                    if ( revertI.amount - history.amount <= 0 ) {
                        persRecipe.personalizedRecipe.ingredients = persRecipe
                            .personalizedRecipe.ingredients
                            .filter( i => !i.substitutionFor
                                        || i.substitutionFor._id.toString() !== historyId );
                    } else {
                        revertI.amount -= history.amount;
                        revertI.substitutionFor = undefined;
                    }

                    persRecipe.save();

                    return res.status( 200 )
                        .json( persRecipe );
                } );
        } );
};

const substituteIngredient = ( req, res ) => {
    const persRecipeId = req.body._id;
    const { substituteId, originalId, amount } = req.body;
    IngredientModel.findById( substituteId ).then( ( subIngredient ) => {
        PersonalizedRecipeModel.findById( persRecipeId )
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
            .populate( {
                path: 'personalizedRecipe.ingredients.ingredient',
                populate: {
                    path: 'substitutionFor',
                    model: 'Substitution',
                },
            } )
            .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
            .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
            .then( ( persRecipe ) => {
                const doubleIngredient = checkDoubleIngredientEntries( persRecipe, substituteId );
                SubstitutionModel
                    .create(
                        {
                            persRecipe: persRecipeId,
                            original: originalId,
                            substitute: substituteId,
                            amount,
                        },
                    )
                    .then( ( subHistory ) => {
                        if ( doubleIngredient ) {
                            doubleIngredient.amount += amount;
                            doubleIngredient.substitutionFor = subHistory._id;
                        } else {
                            persRecipe.personalizedRecipe.ingredients.push( {
                                ingredient: subIngredient,
                                substitutionFor: subHistory._id,
                                amount,
                            } );
                        }
                        persRecipe.personalizedRecipe.ingredients = persRecipe
                            .personalizedRecipe.ingredients
                            .filter( i => i.ingredient._id.toString() !== originalId );
                        persRecipe.save();
                        return res.status( 200 ).json( persRecipe );
                    } );
            } );
    } );
};


module.exports = {
    getAllRecipes,
    getRecipeById,
    insertRecipe,
    getSubstitutions,
    blockSubstitution,
    getSingleRecipeOfUser,
    updatePersonalizedRecipe,
    getRecipesOfUser,
    insertPersonalizedRecipe,
    revertSubstitution,
    substituteIngredient,

};
