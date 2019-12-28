const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const { catchAsync, AppError } = require('../../utils');
const createSendToken = require('./createSendToken');

const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;

  // 0) Check if email and passwords exist
  if (!(passwordCurrent && password && passwordConfirm))
    return next(
      new AppError(
        `Please, provide passwordCurrent, password, and passwordConfirm.`,
        400
      )
    );

  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError(`Your current password is wrong.`, 401));
  }

  // 3) Make sure that new password is not the same as current one
  if (passwordCurrent === password)
    return next(
      new AppError(`Your new password cannot be the same as old password.`, 400)
    );

  // 4) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 5) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

module.exports = updatePassword;
