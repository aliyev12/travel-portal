const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { logError } = require('./utils');
const app = require('./app');
const Configs = require('./models/configsModel');

// This function will exit node process and shutdown the server
const gracefullyShutdownServer = (serv, err, errorType) => {
  const error = `${errorType}!,${
    serv ? ' gracefully' : ''
  } shutting down the server. Error: ${err.name}: ${err.message}.`;
  console.log(err);
  logError(err);
  if (serv) {
    serv.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Listen for an uncaughtException and if one takes place - shutdown the server
process.on('uncaughtException', err => {
  gracefullyShutdownServer(null, err, 'UNCAUGHT EXCEPTION');
});

// Inject global variables into current process
dotenv.config({ path: './.env' });

// Build a database connection string based on environmental variables
const DB =
  process.env.USE_DB === 'remote'
    ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
    : process.env.DATABASE_LOCAL;

/*=====================*/
/* CONNECT TO DATABASE */
/*=====================*/
mongoose
  // .set('debug', true)
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('');
    console.log(
      '\x1b[43m\x1b[31m\x1b[1m%s\x1b[0m',
      ' DB connection successful  '
    );
  })
  .catch(err => {
    // Log the error in mylogfile.log
    logError(err);
    // Shutdown the process and there is no server yet, so second arg is null
    gracefullyShutdownServer(
      null,
      err,
      'DB Connection Failed. Something went wrong while connecting to the DB.'
    );
  });

// Start server
const port = process.env.PORT || 8080;
const server = app.listen(port, async () => {
  const configs = await Configs.find();
  await app.set('configs', configs);
  if (configs)
    console.log(
      '\x1b[46m\x1b[37m\x1b[1m%s\x1b[0m',
      ` Configs loaded from DB    `
    );
  console.log(
    '\x1b[45m\x1b[33m\x1b[1m%s\x1b[0m',
    ` App running on port ${port}  `
  );
  console.log('');
});

/* ERROR EVENT LISTENERS HAVE TO BE AT THE BOTTOM OF THE FILE! */
process.on('unhandledRejection', err => {
  gracefullyShutdownServer(server, err, 'UNHANDLED REJECTION');
});
