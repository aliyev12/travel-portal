const mongoose = require('mongoose');
const validator = require('validator');

const getDifficultyEnum = () => {
  const difficultyValues = ['easy', 'medium', 'difficult', 'rough'];
  let difficultyValuesMessage = '';
  difficultyValues.forEach((value, i, arr) => {
    if (i === 0) {
      difficultyValuesMessage += `Difficulty is either: ${value}, `;
    } else if (i === arr.length - 1) {
      difficultyValuesMessage += `or ${value}.`;
    } else {
      difficultyValuesMessage += `${value}, `;
    }
  });

  return {
    values: difficultyValues,
    message: difficultyValuesMessage
  };
};

const tourShape = {
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal than 40 characters'],
    minlength: [10, 'A tour name must have more or equal than 10 characters']
    // , validate: [validator.isAlpha, 'Tour name must only contain characters'] // Example how to use validator library
  },
  duration: Number,
  maxGroupSize: Number,
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: getDifficultyEnum()
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  summary: String,
  description: {
    type: String,
    trim: true
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
    // select: false
  },
  startDates: {
    type: [Date],
    required: true,
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: `Tour must have at least one start date.`
    }
  },
  secretTour: {
    type: Boolean,
    default: false
  },
  imageCover: String,
  rating: {
    type: Number,
    default: 4.5
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // The "this" is only when creating a new document, and NOT when updating an existing one!
        return val < this.price;
      },
      message: `Price discount {VALUE} cannot be more than the price.`
    }
  },
  slug: String,
  startLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
};

module.exports = tourShape;
