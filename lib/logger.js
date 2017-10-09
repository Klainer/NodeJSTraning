'use strict';

const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : env === 'test' ? '' : 'info'
    })
  ]
});

if (process.env.NODE_ENV === 'test') {
    logger.add(winston.transports.Console, {prettyPrint: true, colorize: true, timestamp: tsFormat, level: 'info'});
}

module.exports = logger;