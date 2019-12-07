const mongoose = require('mongoose');

const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const { catchAsync, AppError, APIFeatures } = require('./../utils');

exports.getReview = factory.getOne({ Review });
exports.deleteReview = factory.deleteOne({ Review });
exports.createReview = factory.createOne({ Review });
exports.getAllReviews = factory.getAll({ Review });
exports.updateReview = factory.updateOne({ Review });

exports.setTourAndUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};


// // /* One way of updating with less requests */
// exports.updateReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findOne({ _id: req.params.id });

//   if (!review) {
//     return next(
//       new AppError(`Review with ID ${req.params.id} was not found.`, 404)
//     );
//   }
//   if (review.user && !review.user._id.equals(req.user.id)) {
//     return next(new AppError('Only the creator of this review can modify it.'));
//   }
//   Object.keys(req.body).forEach(key => {
//     review[key] = req.body[key];
//   });
//   await review.save();
//   res.status(200).json({
//     status: 'success',
//     data: {
//       review
//     }
//   });
// });

// /* Another way of updating with more requests */
// exports.updateReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findOne({ _id: req.params.id });
//   if (!review.user._id.equals(req.user.id)) {
//     return next(new AppError('Only the creator of this review can modify it.'));
//   }

//   const newReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!newReview)
//     return next(
//       new AppError(`Review with ID ${req.params.id} was not found.`, 404)
//     );

//   res.status(200).json({
//     status: 'success',
//     data: {
//       review: newReview
//     }
//   });
// });
