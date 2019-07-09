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

const checkDoubleIngredientEntries = ( persRecipe, substituteId ) => {
    const foundIngredient = persRecipe.personalizedRecipe.ingredients
        .find( ingredient => ingredient.ingredient === substituteId );
    return foundIngredient;
};

const findOriginalIngredient = ( origRecipe, substituteId ) => {
    const foundIngredient = origRecipe.ingredients
        .find( ingredient => ingredient.ingredient === substituteId );
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
                    model: 'Ingredient',
                    populate: {
                        path: 'ingredient.category',
                        model: 'Category',
                    },
                } )
                .populate( {
                    path: 'personalizedRecipe.ingredients.substitutionFor',
                    model: 'Substitution',
                } )
                .populate( 'personalizedRecipe.blockedSubstitutions.orig' )
                .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' )
                .then( ( persRecipe ) => {
                    const ingredient = persRecipe.personalizedRecipe.ingredients
                        .find( i => i.substitutionFor
                        && i.substitutionFor._id.toString() === historyId );


                    const originalIngredient = findOriginalIngredient(
                        persRecipe.personalizedRecipe.origRecipe,
                        history.substitute._id.toString(),
                    );

                    if ( originalIngredient ) {
                        const oldIngredient = findOriginalIngredient(
                            persRecipe.personalizedRecipe.origRecipe,
                            history.original._id.toString(),
                        );
                        persRecipe.personalizedRecipe.ingredients
                            .push( originalIngredient, oldIngredient );
                        _.remove( persRecipe.personalizedRecipe.ingredients,
                            i => i.substitutionFor._id.toString() === historyId );
                        persRecipe.save();
                    } else {
                        _.map( persRecipe.personalizedRecipe.ingredients,
                            ( i ) => {
                                if ( i._id.toString() === ingredient._id.toString() ) {
                                    i.ingredient = i.substitutionFor.original;
                                    delete i.substitutionFor;
                                }
                            } );
                        _.remove( persRecipe.personalizedRecipe.ingredients,
                            i => i._id.toString() === ingredient._id.toString() );
                        persRecipe.save();
                    }

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
                            _.remove(
                                persRecipe.personalizedRecipe.ingredients,
                                ingredient => ingredient.ingredient._id.toString() === originalId,
                            );
                        }
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
