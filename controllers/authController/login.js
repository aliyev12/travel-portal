const User = require('../../models/userModel');
const { AppError, catchAsync } = require('../../utils');
const createSendToken = require('./createSendToken');

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError(`Please provide email and password`, 400));
  }

  // 2) Check if the user exists && password is correct
  const user = await User.findOne({ email }).select(
    'password role name email passwordChangedAt'
  );
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, res);

  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN
  // });
  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
});

module.exports = login;
