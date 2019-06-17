const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const GoalSchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'goal' } );

GoalSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Goal', GoalSchema );
