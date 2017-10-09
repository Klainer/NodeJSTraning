'use strict';

const parser = require('url');
var handlers = {};

/**
 * @class
 * @classdesc Repesent route handler
 */
var Handler = function (method) {
    this.process = function (req, res) {
        return method.apply(this, [req, res]);
    }
}

/**
 * Callback for handle response
 *
 * @callback handlerCallback
 * @param {Object} request - object represents the HTTP request
 * @param {Object} response - object represents the HTTP response
 */

/**
 * Register URL and handler to route table
 * @param {string} url -  request URL 
 * @param {string} httpMehotd - request method
 * @param {handlerCallback} handler - the callback that handle the response
 */
function registerRouteHandler(url, httpMehotd, handler) {
    handlers[url + "--" + httpMehotd] = new Handler(handler);
}

/**
 * Find and return appropriate handler if exist
 * @param {Object} request -  object represents the HTTP request
 * @returns {Handler}
 */
function handleRoute(request) {
    const url = parser.parse(request.url, true);
    let handler = handlers[url.pathname + "--" + request.method];

    if (handler == null && handler == undefined) {
        return new Handler(function(request, response){
            response.statusCode = 404;
            response.end("Request is from unknown source");
        });
    }
    return handler;
}

module.exports = {
    registerRouteHandler,
    handleRoute
}