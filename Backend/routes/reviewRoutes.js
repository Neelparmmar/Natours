const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.route('/my-reviews').get(reviewController.getAllUserReviews);
router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrictRole('user'),
    reviewController.setTourUserId,
    reviewController.createReview,
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictRole('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictRole('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
