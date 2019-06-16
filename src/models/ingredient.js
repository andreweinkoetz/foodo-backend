const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const IngredientSchema = new Schema( {
    foodId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    foodGroup: {
        type: String,
        required: true,
    },
    elements: {
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
    unit:
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
    notForAllergy: {
        type: [ String ],
    },
    notForLifestyles: {
        type: [ String ],
    },
}, { collection: 'ingredient' } );

IngredientSchema.set( 'versionKey', false );

// Export the Movie model
module.exports = mongoose.model( 'Ingredient', IngredientSchema );
