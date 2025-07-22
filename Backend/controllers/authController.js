const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/appError');
const Email = require('../utils/email');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });
};
const createSendToken = (user, statuscode, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    maxAge:
      Number(process.env.JWT_COOKIE_EXPIRED_IN || 7) * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    httpOnly: true,
    samesite: 'None',
  });
  user.password = undefined;
  res.status(statuscode).json({
    status: 'success',
    token,
    user,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // 👇 Prepare profile URL for email
  const url = `${req.protocol}://${req.get('host')}/me`;

  try {
    await new Email(newUser, url).sendWelcome();
  } catch (err) {
    // console.error('❌ Failed to send welcome email:', err);
    // Don't throw error here to avoid blocking signup
  }

  // 👇 Send JWT token regardless of email success
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check email and password exists
  if (!email || !password) {
    return next(new ApiError('please provide email and password ', 400));
  }

  // 2) user exists and password is corrext

  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new ApiError('incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new ApiError('you are not logged in! please login ', 401));
  }

  // 2 verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError('the user belonges to this token is no longer exists'),
      401,
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError('user has changed password. please log in again'),
      401,
    );
  }

  req.user = currentUser;
  next();
});

// eslint-disable-next-line arrow-body-style
exports.restrictRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('you have not permission to perform this action'),
        403,
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('There is no user with this email', 404));
  }

  const resetToken = user.changePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_BASE_URL}/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset(); // ✅ Use your custom email template here

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError(
        'There was an error sending the email. Try again later.',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2 if toke has no expire then there is a user set an new password
  if (!user) return next(new ApiError('token is invalid or expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3 update changepasswrod property for user

  // 4 log the user in send jwt token
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2. Check if posted current password is correct
  const isPasswordCorrect = await user.correctPassword(
    req.body.passwordCurrent,
    user.password,
  );

  if (!isPasswordCorrect) {
    return next(new ApiError('Your current password is wrong', 401));
  }

  // 3. If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Triggers validation and password hashing (if set in schema)

  // 4. Send new JWT token
  createSendToken(user, 200, res);
});
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
