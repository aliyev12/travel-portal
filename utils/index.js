const mongoose = require('mongoose');
const APIFeatures = require('./apiFeatures');
const AppError = require('./AppError');
const catchAsync = require('./catchAsync');
const sendEmail = require('./sendEmail');
const logError = require('./logError');
const toMilliseconds = require('./toMilliseconds');
const onMaliciousActivity = require('./onMaliciousActivity');
const blockBlacklistedIps = require('./blockBlacklistedIps');

const Ref = (ref, required) => {
  const reference = {
    type: mongoose.Schema.ObjectId,
    ref
  };
  if (required) reference.required = [true, required];

  return reference;
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

module.exports = {
  APIFeatures,
  AppError,
  catchAsync,
  sendEmail,
  toMilliseconds,
  logError,
  toMilliseconds,
  onMaliciousActivity,
  blockBlacklistedIps,
  Ref,
  filterObj
};
