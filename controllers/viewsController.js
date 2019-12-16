const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const { catchAsync, AppError, logError, getDomain } = require('../utils');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  if (!tours) {
    return next(new AppError(`Some`, 404));
  }
  // 2) Build template
  // 3) Render that template using tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const { slug } = req.params;
  if (!slug) {
    return next(new AppError(`Tour slug has not been provided.`, 401));
  }

  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError(`There is no tour with that name.`, 404));
  }

  // 2) Build templates

  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .render('login', { title: 'Log into your account', domain: getDomain() });
};

exports.logClientError = (req, res) => {
  const { error } = req.body;
  logError(error, 'client');
  res.status(200).json({ message: 'Error logged.' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    domain: getDomain()
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  if (!(name && email))
    return next(new AppError(`Please, provide name and email.`, 400));

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
