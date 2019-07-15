/* eslint-disable no-unused-vars,no-param-reassign */
const CookingModel = require( '../models/cooking' );
const RecipeModel = require( '../models/recipe' );
const PersonalizedRecipeModel = require( '../models/personalizedRecipe' );
const SubstitutionModel = require( '../models/substitution' );
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
    await CookingModel
        .deleteMany( { user: userId } ).then( () => logger.silly( 'Deletion successful.' ) );

    if ( !possibleSubstitutes ) {
        logger.silly( 'No substitutes found!' );
        res.status( 200 ).json( { undefined } );
        return CookingModel.create( {
            user: userId,
            persRecipe: userRecipe._id,
            possibleSubstitution: undefined,
        } );
    }

    logger.silly( 'Creating new CookingEvent' );
    // write cooking event to database
    CookingModel.create( {
        user: userId,
        persRecipe: userRecipe._id,
        possibleSubstitution: {
            original: possibleSubstitutes.original._id,
            substitutes: possibleSubstitutes.substitutes,
        },
    } );

    res.status( 200 ).json( { possibleSubstitutes } );
};

const getSubstitutes = ( req, res ) => {
    const { userId } = req.body;

    CookingModel.findOne( { user: userId } )
        .populate( 'possibleSubstitution.original' )
        .populate( 'possibleSubstitution.substitutes.substitute' )
        .then( ( cookingEvent ) => {
            cookingEvent.possibleSubstitution.substitutes.map( s => logger.silly( s.name ) );
            return res.status( 200 ).json( cookingEvent.possibleSubstitution.substitutes );
        } );
};

const checkDoubleIngredientEntries = ( persRecipe, substituteId ) => {
    const foundIngredient = persRecipe.personalizedRecipe.ingredients
        .find( ingredient => ingredient.ingredient.toString() === substituteId );
    return foundIngredient;
};

const substituteIngredient = ( persRecipe, substitute, original, amount ) => {
    const doubleIngredient = checkDoubleIngredientEntries( persRecipe, substitute._id.toString() );
    SubstitutionModel
        .create(
            {
                persRecipe: persRecipe._id,
                original: original._id,
                substitute: substitute._id,
                amount,
            },
        )
        .then( ( subHistory ) => {
            if ( doubleIngredient ) {
                doubleIngredient.amount += amount;
                doubleIngredient.substitutionFor = subHistory._id;
            } else {
                persRecipe.personalizedRecipe.ingredients.push( {
                    ingredient: substitute._id,
                    substitutionFor: subHistory._id,
                    amount,
                } );
            }

            persRecipe.personalizedRecipe.ingredients = persRecipe
                .personalizedRecipe.ingredients
                .filter( i => i.ingredient.toString() !== original._id.toString() );

            persRecipe.save();
        } );
};

const substituteOriginal = async ( req, res ) => {
    logger.silly( 'Entering substitute original function.' );

    const { userId } = req.body;
    const { selectedNumber } = req.params;

    logger.silly( `Requested number: ${ selectedNumber }` );

    if ( selectedNumber < 1 || selectedNumber > 3 ) {
        logger.error( 'Wrong User Input' );
    }

    const cookingEvent = await CookingModel
        .findOne( { user: userId } )
        .populate( 'persRecipe' )
        .populate( {
            path: 'persRecipe.personalizedRecipe.ingredients.ingredient',
            model: 'Ingredient',
        } )
        .populate( {
            path: 'possibleSubstitution.substitutes.substitute',
            model: 'Ingredient',
        } )
        .populate( {
            path: 'possibleSubstitution.original',
            model: 'Ingredient',
        } );

    if ( !cookingEvent ) {
        logger.error( 'Event not found' );
    }

    logger.silly( `Cooking Event found: ${ JSON.stringify( cookingEvent ) }` );

    substituteIngredient( cookingEvent.persRecipe,
        cookingEvent.possibleSubstitution.substitutes[ selectedNumber - 1 ].substitute,
        cookingEvent.possibleSubstitution.original,
        cookingEvent.possibleSubstitution.substitutes[ selectedNumber - 1 ].amount );

    return res.status( 200 ).json(
        {
            ingredient: cookingEvent
                .possibleSubstitution.substitutes[ selectedNumber - 1 ].substitute.name,
            original: cookingEvent.possibleSubstitution.original.name,
        },
    );
};

const blockSubstitution = async ( req, res ) => {
    const { userId } = req.body;

    const cookingEvent = await CookingModel
        .findOne( { user: userId } )
        .populate( 'persRecipe' );

    logger.silly( `Cooking Event: ${ JSON.stringify( cookingEvent ) }` );

    if ( !cookingEvent ) {
        logger.error( 'Event not found' );
    } else {
        cookingEvent.persRecipe
            .personalizedRecipe
            .blockedSubstitutions
            .push( cookingEvent.possibleSubstitution.original );

        cookingEvent.persRecipe.save();
    }

    return res.status( 200 ).json( { msg: 'Success!' } );
};

const calculateNutriScore = async ( req, res ) => {
    logger.debug( 'calculateNutriScore function triggered.' );

    const { userId } = req.body;

    const cookingEvent = await CookingModel
        .findOne( { user: userId } ).exec();

    PersonalizedRecipeModel.findById( cookingEvent.persRecipe )
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
        .then( ( r ) => {
            logger.silly( JSON.stringify( r.personalizedRecipe.origRecipe.ingredients ) );
            const oldValues = substitutor
                .calculateNutritionValuesOfIngredientsList(
                    r.personalizedRecipe.origRecipe.ingredients,
                );
            const oldScore = substitutor
                .mapNutriScoreToABCDE( substitutor.calculateNutriScore( oldValues, 'Recipe' ) );

            logger.silly( JSON.stringify( r.personalizedRecipe.ingredients ) );
            const newValues = substitutor
                .calculateNutritionValuesOfIngredientsList(
                    r.personalizedRecipe.ingredients,

                );

            const newScore = substitutor
                .mapNutriScoreToABCDE( substitutor.calculateNutriScore( newValues, 'Recipe' ) );

            res.status( 200 ).send( {
                oldValues, oldScore, newValues, newScore,
            } );
        } );
};

module.exports = {
    startCooking,
    substituteOriginal,
    blockSubstitution,
    getSubstitutes,
    calculateNutriScore,
};
