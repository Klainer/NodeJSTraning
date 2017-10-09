'use strict';

const ENV = (process.env.NODE_ENV || 'development');
const PROD = (ENV === 'production');

let config = {};

if(PROD){
    config = require('./config.js')
} else {
    config = require('./config.dev.js')
}

module.exports = config