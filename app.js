'use strict';

const config = require('./config');
const server = require('./server');

// APP routes shoul be here not in server.js ....

server.runInClusterMode(config);



