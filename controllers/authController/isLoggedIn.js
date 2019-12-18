const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const { catchAsync } = require('../../utils');

// Only for rendered pages, no errors!
const isLoggedIn = async (req, res, next) => {
  console.log('in isLoggedIn')
  const x = JSON.stringify(req.cookies);
  console.log('x = ', x)
  // 1) Getting token and check if it's there
  if (req.cookies && req.cookies.jwt) {
    console.log('line 11')
    try {
      const token = req.cookies.jwt;

      // 2) Verification token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // 3) Check if the user still exists
      const currentUser = await User.findById(decoded.id).select(
        'isActive role name _id id email passwordChangedAt createdAt updatedAt photo'
      );

      // No no user, simply move on to next middleware
      if (!currentUser) return next();

      // 4) Check if the user is active
      if (!currentUser.isActive) return next();

      // 5) Check if user changed password after the token was issued
      if (await currentUser.changedPasswordAfter(decoded.iat)) return next();

      // THERE IS A LOGGED IN USER!
      // Add "user" prop to locals object that gets passed into Pug template.
      // This is the same as passing data to templates when running res.render()
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  // IF there is no cookie, just move on to the next middleware
  next();
};

module.exports = isLoggedIn;
