const validator = require('validator');

const userShape = {
  name: {
    type: String,
    required: [true, 'Please, tell us your name.']
  },
  email: {
    type: String,
    required: [true, 'Please, provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please, provide a valid email address.']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please, provide a password.'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, confirm your password.'],
    minlength: 8,
    select: false,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords did not match.'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
};

module.exports = userShape;
