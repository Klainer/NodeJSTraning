'use strict';

const logger = require('./logger');

/**
 * Wil convert json string to object and finds out propertby by name
 * @param {String} json -  json string
 * @param {String} propertyName - property name to find in json
 * @returns {Boolean} - return true if find a property
 */
function isThereProperty (json, propertyName){
    let propertyDetected = false;

    try{
        JSON.parse(json, function(key, value){
            if(key === propertyName){
                propertyDetected = true;
            }
        })
    } catch(e) {
        logger.error("JSON Prarse Error: " + e.stack);
    }

    return propertyDetected;
}

module.exports = isThereProperty;