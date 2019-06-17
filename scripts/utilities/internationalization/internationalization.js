/**
 * Utility script to reuse in other scripts to internationalize data
 */


/**
 * !!!!!!!!! CAUTION  !!!!!!!!!
 * This script utilizes the Google Cloud Translation API which can become quite expensive
 * Please use this script with caution and only translate less than 500.000 characters per month!
 * Print yourself the "translationsDone" after you are done
 * and add the value to ESTIMATED_CHARS_USED
 */

// Imports the Google Cloud client library
const { Translate } = require( '@google-cloud/translate' );
const dotenv = require( 'dotenv' );

dotenv.config();

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
// Instantiates a client
const translate = new Translate( { projectId } );

// select a locales as a target language
const LOCALES = [
    'en',
    'de',
];

let translationsDone = 0;
const translateTextTo = async ( text, from, to ) => {
    translationsDone += text.length;

    if ( !LOCALES.includes( to ) || !LOCALES.includes( from ) ) {
        throw Error( 'target/base language not supported for Foodo' );
    }
    const options = { from, to };
    const [ translations ] = await translate.translate( text, options );
    return translations;
};

// eslint-disable-next-line no-unused-vars
const testTranslation = async ( text, from, to ) => {
    const translated = await translateTextTo( text, from, to );
    // eslint-disable-next-line no-console
    console.log( `Text: ${ text }` );
    // eslint-disable-next-line no-console
    console.log( `Translation: ${ translated }` );
};

testTranslation( 'Hello World', 'en', 'de' );
console.log( translationsDone );

module.exports = {
    LOCALES,
    translateTextTo,
    translationsDone,
};
