const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
// const AppError = require('../utils/appError');
const factory = require('./handleFactory');

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllUserReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user._id }).populate({
    path: 'tour',
    select: 'name imageCover',
  });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
