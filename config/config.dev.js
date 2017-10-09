'use strict';

const config = {
    trackLogFilePath: './public/trackLog.txt',
    redis: {
        port: 6379,
        host: 'localhost'  
    },
    httpServer: {
        port: 8006,
        host: 'localhost'
    }
}

module.exports = config;