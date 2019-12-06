const mongoose = require('mongoose');
const slugify = require('slugify');
const tourShape = require('./shapes/tourShape');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(tourShape, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create an index for price. When declaring a field as an index, it will be faster
// and more efficient for DB to search for docs based on that index
// Setting index to 1 means ascending order, and -1 is in descending order
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('updatedFromNow').get(function() {
  if (!this.updatedAt) return;
  return fromNow(this.updatedAt);
});

tourSchema.virtual('createdFromNow').get(function() {
  if (!this.createdAt) return;
  return fromNow(this.createdAt);
});

// This is virtual populate for reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

/*=== !!! FOR LEARNING ONLY !!! - UNCOMMENT AND DO STUFF WITH IT IF NEEDED ===*/
// // THE VIRTUAL BELOW WILL TURN NAME TO UPPERCASE
// tourSchema.virtual('nameUpper').get(function() {
//   if (this.name) return this.name.toUpperCase();
//   return '';
// });
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

// DOCUMENT MIDDLEWARE: runs before the .save() command and the .create() command but not when using .insertMany()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* EMBEDDING TOUR GUIDES */
// // Find each user by id in guides array and reassign the guides array with array of actual User objects
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// QUERY MIDDLEWARE
// Pre-query hook for any query that starts with word "find", e.g.: find(), findOne(), findMany() etc...
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// Returns a user friendly string, days/hours/minutes from now
function fromNow(time) {
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
}
