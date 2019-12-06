const jwt = require('jsonwebtoken');
const { toMilliseconds } = require('../../utils');

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  // Set expiration date of a cookie to days specified in .env file
  const cookieOptions = {
    expires: new Date(
      Date.now() + toMilliseconds(`${process.env.JWT_COOKIE_EXPIRES_IN} days`)
    ),
    httpOnly: true // limit browsers only to be able to read cookie
  };

  // Only in production require https
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Delete password from user object
  user.password = undefined;
  user.passwordConfirm = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        role: user.role,
        name: user.name,
        email: user.email,
        passwordChangedAt: user.passwordChangedAt
      }
    }
  });
};

module.exports = createSendToken;
