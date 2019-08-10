/*                                                               *
*                                                                *
*       USE THIS SCRIPT WITH CAUTION!                            *
*       Executing it will wipe the entire ingredient collection! *
*                                                                *
 */

/* eslint-disable */
const fs = require( 'fs' );
const diceCo = require('string-similarity');
const lodash = require('lodash');
const ingredientController = require('../src/controllers/ingredient');
const mongoose = require('mongoose');
const int = require('./utilities/internationalization/internationalization');
require('dotenv').config();

// Prepare input data
const rawData = fs.readFileSync( 'PATH/recipes.json' );
const recipes = JSON.parse( rawData );

// Initialize result array
const ingredientArray = [];

// Converting fields to match our model
const convertFields = (ig) => {

    let igInsert = lodash.cloneDeep(ig);

    igInsert.elements = igInsert.foodAttributes;
    igInsert.elements.Water = igInsert.elements.Wasser;
    igInsert.elements.KiloJoule = igInsert.elements.KCal * 4.184;
    igInsert.unit = { name: igInsert.servings[0].name, amount: igInsert.servings[0].weight};

    delete igInsert.foodAttributes;
    delete igInsert.dataSource;
    delete igInsert.elements.Wasser;
    delete igInsert.servings;

    igInsert = convertAmounts(igInsert);

    if(!igInsert.name || !igInsert.unit.name || isNaN(igInsert.elements.Calcium)){
        return null;
    };

    const nameDE = lodash.cloneDeep(igInsert.name);
    delete igInsert.name;
    igInsert.name = { de: nameDE, en: nameDE};

    return igInsert;

};

// Converting non-standard measuring units (e.g. teelöffel)
const convertAmounts = (ig) => {

    if(ig.unit.name.toLowerCase().includes('gramm') || /^\d+\.?\d*$/.test(ig.unit.name)){
       const convRate = ig.unit.amount/100;
       for(let name in ig.elements){
           ig.elements[name] = parseFloat(ig.elements[name]) / convRate;
       }
       ig.unit = {name: 'gramm', amount: 100};
   } else if(ig.unit.name.toLowerCase().includes('löffel') || ig.unit.name.toLowerCase().includes('liter')){
        const convRate = ig.unit.amount/100;
        for(let name in ig.elements){
            ig.elements[name] = parseFloat(ig.elements[name]) / convRate;
        }
        ig.unit = {name: 'ml', amount: 100};
    }

   return ig;

};

/*
* Evaluate the similarity between current ingredient-name and already inserted ingredients
* based on Sørensen–Dice coefficient: https://en.wikipedia.org/wiki/Sørensen-Dice_coefficient
* e.g. console.log(diceCo.compareTwoStrings('1 el frische vollmilch', '1 l haltbare milch')); >> 0.25
*/
const evalIg = (name) => ingredientArray.some((ig) => diceCo.compareTwoStrings(ig.name.de.toLowerCase(), name.toLowerCase()) > 0.33);

// Iterating all recipes an extracting the ingredients
recipes.map( ( r ) => {
    r.ingredients.map( ( ig ) => {
        // Skipping names of descriptive type (>30)
        if(ig.name.length < 30 && !evalIg(ig.name)) {
            const igInsert = convertFields(ig);
            if (igInsert) ingredientArray.push( igInsert );
        }
    } );
} );

// Uncomment to write to file temporarily.
// fs.writeFileSync("PATH/import.log", JSON.stringify(ingredientArray));

mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true } ).then( () => {
    mongoose.connection.db.dropCollection('ingredient', (err, result) => console.log(err, result));
    let count = 0;
    // Adding to database
    ingredientController.insertIngredientBatch(ingredientArray).then((res)=> {
        res.map((ingredient) => {
           const name = ingredient.name.de;
           delete ingredient.name;
           int.translateTextTo(name,'de','en').then((translation) => {
               count++;
               ingredient.name = {de: name, en: translation};
               console.log(`Translated ${name} to ${translation} #${count}`);
               ingredient.save();
           })
        });
    });
} ).catch((err) => console.log(err));



