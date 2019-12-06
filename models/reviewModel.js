const mongoose = require('mongoose');
const reviewShape = require('./shapes/reviewShape');

const reviewSchema = new mongoose.Schema(reviewShape, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

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
  console.log(stats);
};

reviewSchema.post('save', function() {
  // This points to current review
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
