/* eslint-disable no-param-reassign */
/*                                                               *
*                                                                *
*                   USE THIS SCRIPT WITH CAUTION!                *
*                 Wipes all allergies of ingredients             *
*                                                                *
 */

require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );
const IngredientModel = require( '../src/models/ingredient' );
const LifestyleModel = require( '../src/models/lifestyle' );
const AllergyModel = require( '../src/models/allergy' );

/**
 * Adds the lifestyle to the ingredient.
 * @param ingredient
 * @param lifestyles
 * @returns {Promise<void>}
 */
const addLifeStyleToIngredient = async ( ingredient, ...lifestyles ) => {
    await IngredientModel
        .findOneAndUpdate( { _id: ingredient._id }, { notForLifestyles: lifestyles } ).exec();
};

/**
 * Adds the lifestyle to the ingredient.
 * @param ingredient
 * @param allergy
 * @returns {Promise<void>}
 */
const addAllergyToIngredient = async ( ingredient, allergy ) => {
    if ( allergy ) {
        await IngredientModel
            .findOne( { _id: ingredient._id } ).then( ( i ) => {
                i.notForAllergies = [ allergy ];
                i.save();
            } );
    } else {
        await IngredientModel
            .findOne( { _id: ingredient._id } ).then( ( i ) => {
                i.notForAllergies = [ ];
                i.save();
            } );
    }
};

/**
 * Checks which category matches lifestyle.
 * 0 - None
 * 1 - Vegetarian
 * 2 - Low carb
 * 3 - Vegan
 * @param ingredient
 * @param lifestyles
 */
const checkCategoryForLifestyle = ( ingredient, lifestyles ) => {
    if ( ingredient.category ) {
        switch ( ingredient.category.name ) {
        case 'Dairy products':
            addLifeStyleToIngredient( ingredient, lifestyles[ 3 ] );
            break;
        case 'Oils, fats and shortenings':
            break;
        case 'Meat and poultry': addLifeStyleToIngredient( ingredient, lifestyles[ 1 ],
            lifestyles[ 3 ] );
            break;
        case 'Fish and seafood': addLifeStyleToIngredient( ingredient, lifestyles[ 1 ],
            lifestyles[ 3 ] );
            break;
        case 'Vegetables':
            break;
        case 'Fruits':
            break;
        case 'Breads, cereals and grains': addLifeStyleToIngredient( ingredient, lifestyles[ 2 ] );
            break;
        case 'Soups (canned and diluted)':
            break;
        case 'Desserts and sweets': addLifeStyleToIngredient( ingredient, lifestyles[ 2 ] );
            break;
        case 'Nuts and seeds':
            break;
        case 'Beverages':
            break;
        case 'Spices':
            break;
        default:
            break;
        }
    }
};

/**
 * Checks which category matches allergy.
 * 0 - Gluten
 * 1 - Lactose
 * 2 - Fructose
 * @param ingredient
 * @param allergies
 */
const checkCategoryForAllergies = ( ingredient, allergies ) => {
    if ( ingredient.category ) {
        switch ( ingredient.category.name ) {
        case 'Dairy products': addAllergyToIngredient( ingredient, allergies[ 1 ] );
            break;
        case 'Oils, fats and shortenings': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Meat and poultry': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Fish and seafood': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Vegetables': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Fruits': addAllergyToIngredient( ingredient, allergies[ 2 ] );
            break;
        case 'Breads, cereals and grains': addAllergyToIngredient( ingredient, allergies[ 0 ] );
            break;
        case 'Soups (canned and diluted)': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Desserts and sweets': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Nuts and seeds': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Beverages': addAllergyToIngredient( ingredient, undefined );
            break;
        case 'Spices': addAllergyToIngredient( ingredient, undefined );
            break;
        default:
            break;
        }
    }
};

// Bulk update edited ingredients.
mongoose
    .connect( process.env.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false } )
    .then( async () => {
        const ingredients = await IngredientModel.find().populate( 'category' ).exec();
        const lifestyles = await LifestyleModel.find().exec();
        const allergies = await AllergyModel.find().exec();

        ingredients.map( ( i ) => {
            checkCategoryForLifestyle( i, lifestyles );
            checkCategoryForAllergies( i, allergies );
            return true;
        } );

        IngredientModel.collection.update( {},
            { $unset: { notForAllergy: true } },
            { multi: true, safe: true } ).catch( err => console.log( err ) );
    } );
