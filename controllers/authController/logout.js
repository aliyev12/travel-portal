const { catchAsync } = require('../../utils');

const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logged - out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
});

module.exports = logout;
