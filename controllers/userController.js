const User = require('../models/userModel');
const { catchAsync, AppError, filterObj } = require('./../utils');
const factory = require('./handlerFactory');

// Do NOT update password with this!
exports.updateUser = factory.updateOne({ User });
exports.deleteUser = factory.deleteOne({ User });
exports.getUser = factory.getOne({ User });

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users ? users.length : 0,
    data: { users }
  });
});

/*========*/
/* GET ME */
/*========*/
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

/*===========*/
/* UPDATE ME */
/*===========*/
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not for password updates. Please, use updateMyPassword endpoint.`,
        400
      )
    );
  }
  // 2) Filter out unwanted fields names that do not to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

/*===========*/
/* DELETE ME */
/*===========*/
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

/*=============*/
/* CREATE USER */
/*=============*/
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not exist. Please, use /signup instead.'
  });
};
