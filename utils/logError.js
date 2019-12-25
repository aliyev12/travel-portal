const SimpleNodeLogger = require('simple-node-logger');

const logError = (err, from = 'server') => {
  if (process.env.LOG_ERRORS) {
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

    if (from === 'server') {
      logger.error(err);
    } else if (from === 'client') {
      loggerClientside.error(err);
    }
  }
};

module.exports = logError;
