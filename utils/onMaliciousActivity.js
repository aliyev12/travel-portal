const Configs = require('../models/configsModel');
const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

const onMaliciousActivity = async (property, ip) => {
  const configs = await Configs.findOne();
  const newBlacklist = [...configs.ipsBlacklist].filter(el => el !== ip);
  newBlacklist.push(ip);
  configs.ipsBlacklist = newBlacklist;
  // TODO set app.set('configs', configs)
  await configs.save({ validateBeforeSave: false });
};

module.exports = onMaliciousActivity;
