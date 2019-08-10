/**
 * GoalModel
 * builds the goal db collection with mongoose.
 */

const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

/**
 * Schema for goals.
 * @type {*|Mongoose.Schema}
 */
const GoalSchema = new Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'goal' } );

GoalSchema.set( 'versionKey', false );

module.exports = mongoose.model( 'Goal', GoalSchema );
