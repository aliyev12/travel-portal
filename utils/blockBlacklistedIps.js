const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

const getClientIp = req => {
  let ipAddress = req.connection.remoteAddress;
  if (!ipAddress) {
    return '';
  } // convert from "::ffff:192.0.0.1"  to "192.0.0.1"
  if (ipAddress.substr(0, 7) == '::ffff:') {
    ipAddress = ipAddress.substr(7);
  }
  return ipAddress;
};

module.exports = catchAsync(async (req, res, next) => {
  const configs = req.app.settings.configs;
  if (!configs || !configs.length || (configs && !configs[0].ipsBlacklist)) {
    return next();
  }
  const ipsBlacklist = configs[0].ipsBlacklist;
  var ipAddress = getClientIp(req);
  if (ipsBlacklist.indexOf(ipAddress) !== -1) {
    return next(new AppError('You are blacklisted!', 403));
  }
  next();
});
