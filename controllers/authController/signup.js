const User = require('../../models/userModel');
const { catchAsync, Email } = require('../../utils');
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

  // Build a URL that will be included in a Welcome email to the user.
  // By following that URL, user will be redirected to her new account.
  const url = `${req.protocol}://${req.get('host')}/me`;

  // Send the email with new user info and account link
  await new Email(newUser, url).sendWelcome();

  // Send cookie to user client side to authenticate user automatically
  createSendToken(newUser, 201, res);
});

module.exports = signup;
