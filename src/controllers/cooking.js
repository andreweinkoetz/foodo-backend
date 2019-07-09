/* eslint-disable no-unused-vars */
const CookingModel = require( '../models/cooking' );
const RecipeModel = require( '../models/recipe' );
const PersonalizedRecipeModel = require( '../models/personalizedRecipe' );
const substitutor = require( '../algorithm/substitutor' );
const logger = require( '../logger' ).getLogger( 'CookingController' );

const startCooking = async ( req, res ) => {
    const { userId, clientId, recipeName } = req.body;

    logger.silly( 'Alexa sent us a start cooking request!' );
    logger.silly( `Requesting user: ${ userId }` );
    logger.silly( `Requested recipe: ${ recipeName }` );

    const recipe = await RecipeModel.findOne( { name: recipeName } );
    if ( !recipe ) {
        logger.error( 'Recipe not found' );
    }
    let userRecipe = await PersonalizedRecipeModel
        .findOne( { 'personalizedRecipe.origRecipe': recipe._id, user: userId } );
    if ( !userRecipe ) {
        // we started cooking this recipe for the first time, create a user recipe
        userRecipe = await PersonalizedRecipeModel.create( {
            user: userId,
            client: clientId,
            personalizedRecipe: {
                origRecipe: recipe._id,
                ingredients: recipe.ingredients,
                blockedSubstitutions: [],
            },
        } );
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

    const possibleSubstitutes = substitutor.getAlternativesForWorstIngredient( userRecipe );
    logger.silly( `Possible substitutes: ${ possibleSubstitutes }` );


    logger.silly( `Deleting all CookingEvents of user: ${ userId }` );
    // delete all old CookingEvents of user
    CookingModel.deleteMany( { user: userId } ).then( () => logger.silly( 'Deletion successful.' ) );

    logger.silly( 'Creating new CookingEvent' );
    // write cooking event to database
    CookingModel.create( {
        user: userId,
        persRecipe: userRecipe._id,
        possibleSubstitution: {
            original: possibleSubstitutes.original._id,
            substitutes: possibleSubstitutes.substitutes
                .map( s => ( { ingredient: s.ingredient, amount: s.amount } ) ),
        },
    } );

    res.status( 200 ).json( { possibleSubstitutes } );
};

const substituteOriginal = async ( req, res ) => {
    const { userId } = req.body;
    const { selectedNumber } = req.params;

    if ( selectedNumber < 1 || selectedNumber > 3 ) {
        logger.error( 'Wrong User Input' );
    }

    const cookingEvent = await CookingModel
        .findOne( { user: userId } )
        .populate( 'possibleSubstitution.substitutes.ingredient' );
    if ( !cookingEvent ) {
        logger.error( 'Event not found' );
    }
    const persRecipeId = cookingEvent.persRecipe;
    const originalId = cookingEvent.possibleSubstitution.original;
    const substituteId = cookingEvent.possibleSubstitution
        .substitutes[ selectedNumber - 1 ].ingredient._id;
    const { amount } = cookingEvent.possibleSubstitution
        .substitutes[ selectedNumber - 1 ];

    // TODO do the same as in the new substitute recipe ingredient function
    res.status( 200 ).json( { msg: 'Success!' } );
};

const blockSubstitution = async ( req, res ) => {
    const { userId } = req.body;

    const cookingEvent = await CookingModel
        .findOne( { user: userId } )
        .populate( 'possibleSubstitution.substitutes.ingredient' );
    if ( !cookingEvent ) {
        logger.error( 'Event not found' );
    }

    // TODO do the same as in the new block recipe ingredient function

    res.status( 200 ).json( { msg: 'Success!' } );
};

module.exports = {
    startCooking,
    substituteOriginal,
    blockSubstitution,
};
