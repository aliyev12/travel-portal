const login = require('./login');
const signup = require('./signup');
const protectRoute = require('./protectRoute');
const restrictTo = require('./restrictTo');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');
const updatePassword = require('./updatePassword');
const createSendToken = require('./createSendToken');

module.exports = {
  login,
  signup,
  protectRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  createSendToken
};
