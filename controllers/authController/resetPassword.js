const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const { AppError, catchAsync } = require('../../utils');
const createSendToken = require('./createSendToken');

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError(`Token is invalid or has expired.`, 400, 'RP-01'));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Log the user in, send JWT to client
  createSendToken(user, 200, req, res);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: 'success',
    token
  });
});

module.exports = resetPassword;

// const { promisify } = require('util');
// const jwt = require('jsonwebtoken');
// const User = require('../../models/userModel');
// const { AppError, catchAsync, sendEmail } = require('../../utils');

// const resetPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on the token
//   const user = await User.findOne({ passwordResetToken: req.params.token });
//   if (!user) {
//     return next(
//       new AppError(
//         'Something went wrong - your reset link has probably expired. Please, try resetting your password again.',
//         404,
//         'RP-01'
//       )
//     );
//   }

//   // 2) If token has not expired, and there is user, set the new password
//   if (user.passwordResetExpires < new Date().getTime()) {
//     return next(
//       new AppError(
//         'Your reset link has expired. Please, try resetting your password again.',
//         404,
//         'RP-02'
//       )
//     );
//   }

//   user.password = req.body.password;

//   user.passwordConfirm = req.body.passwordConfirm;
//   // 3) Update passwordChangedAt property for the user
//   user.passwordChangedAt = new Date();
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 4) Log the user in, send JWT to client
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN
//   });
//   res.status(200).json({
//     status: 'success',
//     token
//   });
// });

// module.exports = resetPassword;
