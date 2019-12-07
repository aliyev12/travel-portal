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

// Returns a user friendly string, days/hours/minutes from now
const fromNow = time => {
  const currentTime = Date.now();
  const timeToMili = new Date(time).getTime();
  const miliFromNow = currentTime - timeToMili;
  const inDays = Math.floor(miliFromNow / 86400000);
  const inHours = Math.floor(miliFromNow / 3600000);
  const inMinutes = Math.floor(miliFromNow / 60000);
  const inhoursRemaining = inHours - inDays * 24;
  const inMinRemaining = inMinutes - inhoursRemaining * 60;
  const printDays =
    inDays === 0
      ? ''
      : `${inDays} day${inDays === 1 ? '' : 's'} ${
          inHours !== 0 || inMinutes !== 0 ? 'and ' : ''
        }`;
  const printHours =
    inhoursRemaining === 0
      ? ''
      : `${inhoursRemaining} hour${inhoursRemaining === 1 ? '' : 's'} ${
          inMinutes !== 0 ? 'and ' : ''
        }`;
  const printMinutes =
    inMinRemaining === 0
      ? ''
      : `${inMinRemaining} minute${inMinRemaining === 1 ? '' : 's'} `;

  return `${printDays}${printHours}${printMinutes}${
    miliFromNow < 60000 ? 'Just now' : 'ago'
  }`;
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
  filterObj,
  fromNow
};
