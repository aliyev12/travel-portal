const SimpleNodeLogger = require('simple-node-logger');

const opts = {
  logFilePath: 'logs-errors-from-server.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
};

const optsClient = {
  logFilePath: 'logs-errors-from-clientside.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
};

const logger = SimpleNodeLogger.createSimpleLogger(opts);
const loggerClientside = SimpleNodeLogger.createSimpleLogger(optsClient);

const logError = (err, from = 'server') => {
  if (from === 'server') {
    logger.error(err);
  } else if (from === 'client') {
    loggerClientside.error(err);
  }
};

module.exports = logError;
