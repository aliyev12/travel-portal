const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const { AppError, catchAsync } = require('../../utils');

// Authorization - only allow access to roles specified in arguments
const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have a permission to perform this action.',
          403,
          'RT-01'
        )
      );
    }

    next();
  });
};

module.exports = restrictTo;
