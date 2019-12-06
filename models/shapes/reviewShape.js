const mongoose = require('mongoose');
const { Ref } = require('../../utils');

const reviewShape = {
  review: {
    type: String,
    required: [true, 'A review must have some text'],
    trim: true,
    maxlength: [200, 'A review must have less or equal than 200 characters'],
    minlength: [3, 'A review must have more or equal than 3 characters'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
    // select: false
  },
  tour: Ref('Tour', 'Review must belong to a tour.'),
  user: Ref('User', 'Review must belong to a user.')
  // tour: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Tour'
  // },
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User'
  // }
};

module.exports = reviewShape;
