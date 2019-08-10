/**
 * IngredientModel
 * builds the ingredient db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for an ingredient.
 * @type {*|Mongoose.Schema}
 */
const IngredientSchema = new Schema( {
    foodId: { // legacy info of original data source
        type: String,
        required: true,
    },
    name: { // name of ingredient en/de
        en: {
            type: String,
            required: true,
        },
        de: {
            type: String,
            required: true,
        },
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }, // ref. to category
    elements: { // ingredient elements from original data source
        Cholesterol: {
            type: Number,
            required: true,
        },
        Phosphorous: {
            type: Number,
            required: true,
        },
        VitaminABetaCarotin: {
            type: Number,
            required: true,
        },
        Carbohydrate: {
            type: Number,
            required: true,
        },
        KCal: {
            type: Number,
            required: true,
        },
        KiloJoule: {
            type: Number,
            required: true,
        },
        Copper: {
            type: Number,
            required: true,
        },
        DietaryFiber: {
            type: Number,
            required: true,
        },
        TotalFat: {
            type: Number,
            required: true,
        },
        VitaminB12: {
            type: Number,
            required: true,
        },
        Water: {
            type: Number,
            required: true,
        },
        Iron: {
            type: Number,
            required: true,
        },
        VitaminE: {
            type: Number,
            required: true,
        },
        AddedSugars: {
            type: Number,
            required: true,
        },
        Calcium: {
            type: Number,
            required: true,
        },
        Zinc: {
            type: Number,
            required: true,
        },
        Magnesium: {
            type: Number,
            required: true,
        },
        Manganese: {
            type: Number,
            required: true,
        },
        VitaminARetinol: {
            type: Number,
            required: true,
        },
        PUFA: {
            type: Number,
            required: true,
        },
        Folate: {
            type: Number,
            required: true,
        },
        Riboflavin: {
            type: Number,
            required: true,
        },
        Thiamine: {
            type: Number,
            required: true,
        },
        Protein: {
            type: Number,
            required: true,
        },
        Salt: {
            type: Number,
            required: true,
        },
        Fluoride: {
            type: Number,
            required: true,
        },
        Omega3: {
            type: Number,
            required: true,
        },
        VitaminB6: {
            type: Number,
            required: true,
        },
        MUFA: {
            type: Number,
            required: true,
        },
        AlcoholConcentrate: {
            type: Number,
            required: true,
        },
        VitaminC: {
            type: Number,
            required: true,
        },
        Iodine: {
            type: Number,
            required: true,
        },
        SFA: {
            type: Number,
            required: true,
        },
        VitaminD: {
            type: Number,
            required: true,
        },
    },
    unit: // the unit of this ingredient (e.g. 100 gramm)
        {
            name: {
                type: String,
                required: true,
                default: 'UNKNOWN',
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    notForAllergies: [ { type: Schema.Types.ObjectId, ref: 'Allergy' } ], // ref. to allergies
    notForLifestyles: [ { type: Schema.Types.ObjectId, ref: 'Lifestyle' } ], // ref. to lifestyles

}, { collection: 'ingredient' } );

IngredientSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Ingredient', IngredientSchema );
