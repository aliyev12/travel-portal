const { AppError, logError } = require('../utils');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error = new AppError(message, 400);
  return new AppError(error, 400, '0001');
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400, '0002');
};

const handleJWTError = err =>
  new AppError('Something went wrong. Please, log in again.', 401, '0003');
const handleJWTExpired = err =>
  new AppError('Your session has expired. Please, log in again.', 401, '0004');

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400, '0005');
};

// Error response when in development
const sendErrorDev = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      errorCode: err.errorCode
    });
  }
  // b) RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong.',
    msg: err.message
  });
};

// Error response when in production
const sendErrorProd = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errorCode: err.errorCode
      });
      // Programming or other unknown error: don't leak details to client
    }
    // Send genetic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
      errorCode: err.errorCode
    });
  }
  // b) RENDERED WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong.',
      msg: err.message
    });
    // Programming or other unknown error: don't leak details to client
  }
  // Send genetic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong.',
    msg: 'Please, try again later.'
  });
};

module.exports = (err, req, res, next) => {
  logError(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    error.message = `${err.message}`;
    // Provide custom error messages for different types of errors that go into prod
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpired(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, req, res);
  }
};

/* ERROR CODES:
// Errors from: errorController.js
0000 - No error code provided
0001 - Mongo DB CastError
0002 - Duplicate fields error
0002 - Wrong JWT token has been received
0004 - JWT token has expired
0005 - ValidationError form DB

// Errors from: authController.js
AC-01 - User with ID decoded from JWT token does not exist <authController.js -> .protect()>
AC-02 - User's .isActive property is set to false in db -- so, the use has been deactivated by admin
AC-03 - User's token has not been received. Token is at aythorization[1], so if there is nothing at index 1 then you get this error
AC-04 - User's password has been changed after the token has been created.

// Errors from: forgotPassword.js
FP-01 - User tried to use forgotPassword, but was not found in db
FP-02 - This error occurs when trying to send an email with password reset link using sendEmail() function

// Errors from: app.js
A-01 - Route has not been found. Error is comming from catch all * route

// Errors from resetPassword.js
RP-01 - User based on hashed token and it's passwordResetExpires date received as params does not exist
*/
