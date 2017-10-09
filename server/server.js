"use strict";

const http = require('http');
const fs = require('fs');
const redis = require('redis');

const router = require('../lib/router');
const logger = require('../lib/logger');
const propertyFinder = require('../lib/jsonPropertyFinder');
const defaultConfig = require('../config');

const ENV = (process.env.NODE_ENV || 'development');
const isTestEnv = ENV === 'test';

const contentTypes = {
    JSON: 'application/json',
    HTML: 'text/html'
};
const httpMethods = {
    GET: 'GET',
    POST: 'POST'
};

var redisClient = null;
var httpServer = null;
var config = {};

/**
 * Start HTTP server
 * @param {Object} appConfig - configuration object
 */
function start(appConfig) {
    if (appConfig === null || appConfig === undefined) {
        logger.error('No options object supplied!');
        return;
    }

    config = appConfig;

    redisClient = redis.createClient(config.redis.port, config.redis.host);
    redisClient.on('connect', function () {
        logger.debug('REDIS: connection success!');
    });

    httpServer = http.createServer(_handleHttpRequest);
    httpServer.listen(config.httpServer.port, config.httpServer.host);
}

/**
 * Will STOP HTTP server
 */
function stop() {
    httpServer
        .close()
        .on('close', function () { redisClient.end(true); })
        .on('error', function (e) { logger.error("Stopping Server" + e) });
}

/**
 * Server request callback
 * @param {Object} request -  object represents the HTTP request
 * @param {Object} response - object represents the HTTP response
 */
function _handleHttpRequest(request, response) {

    const { headers } = request;
    const contentType = headers['content-type'];

    router.registerRouteHandler("/count", httpMethods.GET, function (request, response) {
        redisClient.get('count', function (err, reply) {
            if (err) throw err;
            response.write(reply);
            response.statusCode = 200;
            response.end();
        });
    });

    router.registerRouteHandler("/track", httpMethods.GET, function (request, response) {
        response.writeHead(200, { "Content-Type": contentTypes.HTML });
        response.end("This URL support only HTTP POST!");
    });

    router.registerRouteHandler("/track", httpMethods.POST, function (request, response) {
        if (contentType === contentTypes.JSON) {

            let body = [];

            request.on('error', (err) => {
                logger.error(err);
                response.end("Error in serving request.");
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();

                let propertyExists = propertyFinder(body, 'count')

                if (propertyExists && !isTestEnv) {
                    redisClient.incr('count', function (err, reply) {
                        if (err) throw err;
                    });
                }

                if (!isTestEnv) {
                    fs.appendFile(config.trackLogFilePath, body, function (err) {
                        if (err) throw err;
                    });
                }

                response.writeHead(200, { "Content-Type": contentTypes.JSON });
                response.end();
            });
        } else {
            response.writeHead(404, { "Content-Type": contentTypes.HTML });
            response.end("Content type must be: " + contentTypes.JSON);
        }
    });

    const handler = router.handleRoute(request);
    handler.process(request, response);
}


if (isTestEnv) {
    start(defaultConfig);
}

module.exports = {
    redisClient: redisClient,
    httpServer: httpServer,
    start: start,
    stop: stop
};