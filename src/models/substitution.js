const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const SubstitutionSchema = new Schema( {
    persRecipe: { type: Schema.Types.ObjectId, ref: 'PersonalizedRecipe' },
    original: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
    substitute: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
}, { collection: 'substitution' } );

SubstitutionSchema.set( 'versionKey', false );
SubstitutionSchema.set( 'timestamps', true );

module.exports = mongoose.model( 'Substitution', SubstitutionSchema );
