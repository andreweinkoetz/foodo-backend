/* eslint-disable no-unused-vars */
const CookingModel = require( '../models/cooking' );
const RecipeModel = require( '../models/recipe' );
const PersonalizedRecipeModel = require( '../models/personalizedRecipe' );
const substitutor = require( '../algorithm/substitutor' );

const startCooking = async ( req, res ) => {
    const { recipeName, userId, clientId } = req.body;

    const recipe = await RecipeModel.findOne( { name: recipeName } );
    if ( !recipe ) {
        throw Error( 'Recipe not found' );
    }
    let userRecipe = await PersonalizedRecipeModel
        .findOne( { 'personalizedRecipe.origRecipe': recipe._id, user: userId } );
    if ( !userRecipe ) {
        // we started cooking this recipe for the first time, create a user recipe
        userRecipe = await new RecipeModel( {
            user: userId,
            client: clientId,
            personalizedRecipe: {
                origRecipe: recipe._id,
                ingredients: recipe.ingredients,
                blockedSubstitutions: [],
            },
        } ).create();
    }
    userRecipe = await PersonalizedRecipeModel
        .findById( userRecipe._id )
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
        .populate( 'personalizedRecipe.blockedSubstitutions.blockedSubs' );

    // todo: call https://github.com/MrMuchacho/foodo_substitutions/issues/10 instead
    const possibleSubstiutes = substitutor.calculateSubstitutions( userRecipe );

    // delete all old CookingEvents of user
    CookingModel.deleteMany( { user: userId } );

    // write cooking event to database
    CookingModel.create( {
        user: userId,
        persRecipe: userRecipe._id,
        possibleSubstitution: {
            original: possibleSubstiutes.original._id,
            substitutes: possibleSubstiutes.substitutes,
        },
    } );

    res.status( 200 ).json( { possibleSubstiutes } );
};

const substituteOriginal = async ( req, res ) => {
    const { userId, selectedNumber } = req.body;

    if ( selectedNumber < 1 || selectedNumber > 3 ) {
        throw Error( 'Wrong User Input' );
    }

    const cookingEvent = await CookingModel
        .findOne( { user: userId } )
        .populate( 'possibleSubstitution.substitutes.ingredient' );
    if ( !cookingEvent ) {
        throw Error( 'Event not found' );
    }
    const persRecipeId = cookingEvent.persRecipe;
    const originalId = cookingEvent.possibleSubstitution.original;
    const substituteId = cookingEvent.possibleSubstitution
        .substitutes[ selectedNumber - 1 ].ingredient._id;
    const { amount } = cookingEvent.possibleSubstitution
        .substitutes[ selectedNumber - 1 ];

    // TODO do the same as in the new substiute recipe ingredient function
    res.status( 200 ).json( { msg: 'Success!' } );
};

const blockSubstitution = async ( req, res ) => {
    const { userId, selectedNumber } = req.body;

    if ( selectedNumber < 1 || selectedNumber > 3 ) {
        throw Error( 'Wrong User Input' );
    }

    const cookingEvent = await CookingModel
        .findOne( { user: userId } )
        .populate( 'possibleSubstitution.substitutes.ingredient' );
    if ( !cookingEvent ) {
        throw Error( 'Event not found' );
    }

    // TODO do the same as in the new block recipe ingredient function

    res.status( 200 ).json( { msg: 'Success!' } );
};

module.exports = {
    startCooking,
    substituteOriginal,
    blockSubstitution,
};