const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const { catchAsync } = require('../../utils');
const createSendToken = require('./createSendToken');

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  createSendToken(newUser, 201, res);
});

module.exports = signup;
