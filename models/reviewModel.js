const mongoose = require('mongoose');
const reviewShape = require('./shapes/reviewShape');
const Tour = require('../models/tourModel');

const reviewSchema = new mongoose.Schema(reviewShape, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// DOESN'T ALWAYS WORK! Make combination of tour and user IDs at each review unique.
// This will make it so that each user can ONLY provide
// ONE review for a specific tour - DOESN'T ALWAYS WORK!.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Anytime you run some kind of find method on reviews - pre-populate all users
// becasuse review only holds the ID of the user.
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  /*  
  // This commented out code block is for if you want to populate  
  // tours and users into each review. Uncomment it out if you wanna use it.
  this.populate({
    path: 'tour',
    select: 'name'
  })
  .populate({
    path: 'user',
    select: 'name photo'
  });
  */
  next();
});

// Instead of passing ratingsQuantity and ratingsAverage manually when creating
// a new tour, use this static method and mongoDB's aggregate functions to
// calculate those to and set them on to referred tour
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// After a review finished saving, calculate averages for it
reviewSchema.post('save', function() {
  // This points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// Run this pre and the next post hooks to update averages
//  when user updates a review
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
