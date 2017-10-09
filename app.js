'use strict';

const config = require('./config');
const server = require('./server').server;

server.start(config);
