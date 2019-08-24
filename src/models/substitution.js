/**
 * SubstitutionModel
 * builds the substitution db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for substitutions
 * Used to make Cooking process via Alexa permanent.
 * Required because Alexa can not handle any state (lambda function)
 * @type {*|Mongoose.Schema}
 */
const SubstitutionSchema = new Schema( {
    persRecipe: { type: Schema.Types.ObjectId, ref: 'PersonalizedRecipe' }, // ref. to recipe
    original: { type: Schema.Types.ObjectId, ref: 'Ingredient' }, // ref. to ingredient to be replaced
    substitute: { type: Schema.Types.ObjectId, ref: 'Ingredient' }, // ref. to replacing ingredient
    amount: { type: Number, required: true },
}, { collection: 'substitution' } );

SubstitutionSchema.set( 'versionKey', false );
SubstitutionSchema.set( 'timestamps', true );

module.exports = mongoose.model( 'Substitution', SubstitutionSchema );
