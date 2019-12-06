const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const configsShape = require('./shapes/configsShape');
const { toMilliseconds } = require('../utils');

const configsSchema = new mongoose.Schema(configsShape, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Configs = mongoose.model('Configs', configsSchema);

module.exports = Configs;




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// configsSchema.pre('save', async function(next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);
//   // Delete the passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });

// configsSchema.pre('save', function(next) {
//   if (!this.isModified('password') || this.isNew) return next();
//   // Subtracting 1 second will always ensure that the passwordChangedAt will be not
//   // before token exp date, otherwise if db takes longer, users will never be able to log in.
//   this.passwordChangedAt = Date.now() - toMilliseconds('1 second');
//   next();
// });

// configsSchema.methods.correctPassword = async function(
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// // This method checked if the password has been changed after the token has been created
// // It returns true if password is newer than token, and false otherwise
// configsSchema.methods.changedPasswordAfter = async function(JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     // Date of token creation is before time of changing password
//     return JWTTimestamp < changedTimestamp;
//   }

//   // False means password NOT changed
//   return false;
// };

// configsSchema.methods.createPasswordResetToken = async function() {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.passwordResetExpires = Date.now() + toMilliseconds('10 minutes');

//   return resetToken;
// };

// configsSchema.pre(/^find/, function(next) {
//   // This points to the current query
//   this.find({ isActive: { $ne: false } });
//   next();
// });