const mongoose = require("mongoose");
const slugify = require("slugify");
const tourShape = require("./shapes/tourShape");
const User = require("./userModel");
const { fromNow } = require("../utils");

const tourSchema = new mongoose.Schema(tourShape, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/*=========*/
/* INDEXES */
/*=========*/

// Create an index for price. When declaring a field as an index, it will be faster
// and more efficient for DB to search for docs based on that index
// Setting index to 1 means ascending order, and -1 is in descending order
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

/*================================*/
/* SET CREATED & UPDATED FROM NOW */
/*================================*/

tourSchema.virtual("updatedFromNow").get(function() {
  if (!this.updatedAt) return;
  return fromNow(this.updatedAt);
});
tourSchema.virtual("createdFromNow").get(function() {
  if (!this.createdAt) return;
  return fromNow(this.createdAt);
});

/*============================================================*/
/* CREATE REVIEWS PROP ON TOUR THAT ADDS REFERENCE TO REVIEWS */
/*============================================================*/

// This is virtual populate for reviews. It is so that we can create a
// two way reference where each review refers to a tour and each tour
// refers to review. Instead of manually setting this relationship, we can create
// mongoose virtual field that does the same thing.
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id"
});

/*=====================*/
/* SET SLUG - PRE SAVE */
/*=====================*/

// DOCUMENT MIDDLEWARE: runs before the .save() command and the .create() command but not when using .insertMany()
tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/*====================================================*/
/* EXCLUDE SECRET TOURS AND SET START DATE - PRE FIND */
/*====================================================*/

// Pre-query hook for any query that starts with word "find", e.g.: find(), findOne(), findMany() etc...
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

/*=====================================*/
/* POPULATE GUIDES IN TOURS - PRE FIND */
/*=====================================*/

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt"
  });
  next();
});

/*======================*/
/* EXCLUDE SECRET TOURS */
/*======================*/

// /* Commented out for now because this one conflicts with .getDistances
// controller. There, when using $geoNear aggregate, it always needs to
// be the first ggregate in this.pipeline() array */
// // Exclude all secret tours when hitting 'tours/tour-stats' endpoint
// // AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   console.log('this.pipeline() = ', this.pipeline());

//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

/*=====================*/
/* UPPERCASE TOUR NAME */
/*=====================*/

// // THE VIRTUAL BELOW WILL TURN NAME TO UPPERCASE
// tourSchema.virtual('nameUpper').get(function() {
//   if (this.name) return this.name.toUpperCase();
//   return '';
// });

/*==========================*/
/* SHORTEN DESC TO 50 CHARS */
/*==========================*/

// // RETURNS A SHORTER DESCRIPTION
// tourSchema.virtual('descShort').get(function() {
//   if (this.description) {
//     const newDesc = this.description
//       .split('')
//       .slice(0, 50)
//       .join('');
//     return `${newDesc}...`;
//   }
//   return '';
// });

/*===============================*/
/* EXAMPLE PRE & POST SAVE HOOKS */
/*===============================*/

// // EXAMPLE PRE SAVE HOOK - UNCOMMENT AND DO STUFF WITH IT IF NEEDED
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });
// // EXAMPLE AFTER SAVE HOOK - UNCOMMENT AND DO STUFF WITH IT IF NEEDED
// tourSchema.post('save', function(doc, next) {
//   console.log('doc = ', doc);
//   next();
// });

/*=====================================*/
/* POPULATE GUIDES IN TOURS - PRE SAVE */
/*=====================================*/

// Find each user by id in guides array and reassign the guides array with array of actual User objects
tourSchema.pre("save", async function(next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
