/* eslint-disable no-shadow */
const winston = require( 'winston' );
const dotenv = require( 'dotenv' );

if ( !process.env.IS_PROD ) {
    dotenv.config();
}

const {
    combine, timestamp, label,
} = winston.format;

const defaultFormat = winston.format.printf( ( {
    level, message, label, timestamp,
} ) => `${ timestamp } [${ label }] ${ level }: ${ message }` );

const getLogger = logLabel => winston.createLogger( {
    transports: [
        new winston.transports.Console( { level: process.env.LOG_LEVEL } ),
    ],
    format: combine(
        label( { label: logLabel } ),
        timestamp(),
        defaultFormat,
    ),
} );

module.exports = {
    getLogger,
};
