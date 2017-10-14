"use strict";

const cluster = require('./cluster.js');
const server = require('./server.js');

module.exports = {
    runInClusterMode: cluster.start,
    runInNoClusterMode: server.start
}