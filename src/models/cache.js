const GoalModel = require( '../models/goal' );
const LifestyleModel = require( '../models/lifestyle' );
const AllergyModel = require( '../models/allergy' );
const CategoryModel = require( '../models/allergy' );


const goals = GoalModel.find().exec();
const lifestyles = LifestyleModel.find().exec();
const allergies = AllergyModel.find().exec();
const categories = CategoryModel.find().exec();

module.exports = {
    goals,
    lifestyles,
    allergies,
    categories,
};
