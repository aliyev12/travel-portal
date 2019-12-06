const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const { AppError, catchAsync } = require('../../utils');

const protectRoute = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token = '';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in. Please, login to get access.',
        401,
        'AC-03'
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if the user still exists
  const currentUser = await User.findById(decoded.id).select(
    'isActive role name _id id email passwordChangedAt createdAt updatedAt'
  );

  if (!currentUser) {
    return next(
      new AppError('You do not have an account. Please, sign up.', 401, 'AC-01')
    );
  }

  // 4) Check if the user is active
  if (!currentUser.isActive) {
    return next(new AppError('Your account is inactive.', 401, 'AC-02'));
  }

  // 5) Check if user changed password after the token was issued
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'You recently changed your password. Please, log in again.',
        401,
        'AC-04'
      )
    );
  }
  
  // >> GRANT ACCESS TO PROTECTED ROUTE !
  // Update the req.user with whatever user that was retrieved based on token ID
  // So, if someone just sends the right token in headers without actually being logged in,
  // ...that someone will be automatically logged in.
  req.user = currentUser;
  next();
});

module.exports = protectRoute;
