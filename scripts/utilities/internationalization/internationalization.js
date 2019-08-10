/**
 * Utility script to reuse in other scripts to internationalize data
 */


/**
 * !!!!!!!!! CAUTION  !!!!!!!!!
 * This script utilizes the Google Cloud Translation API which can become quite expensive
 * Please use this script with caution and only translate less than 500.000 characters per month!
 */

// Imports the Google Cloud client library
// eslint-disable-next-line import/no-extraneous-dependencies
const { Translate } = require( '@google-cloud/translate' );
const dotenv = require( 'dotenv' );

dotenv.config();

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
// Instantiates a client
const translate = new Translate( { projectId } );

// select a locale as a target language
const LOCALES = [
    'en',
    'de',
];

// start translation process with Google
const translateTextTo = async ( text, from, to ) => {
    if ( !LOCALES.includes( to ) || !LOCALES.includes( from ) ) {
        throw Error( 'target/base language not supported for Foodo' );
    }
    const options = { from, to };
    const [ translations ] = await translate.translate( text, options );
    return translations;
};

module.exports = {
    LOCALES,
    translateTextTo,
};
