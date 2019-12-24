const User = require('../../models/userModel');
const { AppError, catchAsync, logError, Email } = require('../../utils');

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError('There is no user with email address.', 404, 'FP-01')
    );
  }

  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  // !!! TURN OFF VALIDATION BEFORE SAVE, OTHERWISE WON'T WORK!
  // This is done because some other user model fields are marked as required in User schema,
  // so trying to save without providing those values will trigger validation of those fields.
  await user.save({ validateBeforeSave: false });

  try {
    // 3) Send user an email with reset password link
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: `Reset token has been sent to user's email.`
    });
  } catch (err) {
    logError(err);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500,
        'FP-02'
      )
    );
  }
});

module.exports = forgotPassword;
