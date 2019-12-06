const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const { catchAsync, AppError } = require('../../utils');
const createSendToken = require('./createSendToken');

const updatePassword = catchAsync(async (req, res, next) => {
  const { email, currentPassword, newPassword, newPasswordConfirm } = req.body;

  // 1) Check if email and passwords exist

  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(`Your current password is wrong.`, 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN
  // });
  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
});

module.exports = updatePassword;
// const jwt = require('jsonwebtoken');
// const User = require('../../models/userModel');
// const { catchAsync, AppError } = require('../../utils');

// const updatePassword = catchAsync(async (req, res, next) => {
//   const { email, currentPassword, newPassword, newPasswordConfirm } = req.body;

//   // 1) Check if email and passwords exist
//   if (!email || !currentPassword || !newPassword || !newPasswordConfirm) {
//     return next(new AppError(`Please provide email and passwords`, 400));
//   }

//   // 1) Get user from collection
//   const user = await User.findOne({
//     email: req.body.email,
//     isActive: { $eq: true }
//   }).select('password');

//   // 2) Check if POSTed current password is correct
//   if (!user || !(await user.correctPassword(currentPassword, user.password))) {
//     return next(new AppError('Incorrect email or password', 401));
//   }

//   // 3) If so, update password
//   user.password = newPassword;
//   user.passwordConfirm = newPasswordConfirm;
//   user.save();

//   // 4) Log user in, send JWT
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN
//   });
//   res.status(200).json({
//     status: 'success',
//     token
//   });
// });

// module.exports = updatePassword;
