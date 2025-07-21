const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
// post /tour/gnvlsnvjjs/review
// get /tour/gnvlsnvjjs/review
// get /tour/gnvlsnvjjs/review/dgsbigdf55

router.use('/:tourid/reviews', reviewRouter);
router.route('/top-5-cheap').get(tourController.getTop5CheapTours);
router.route('/tourStats').get(tourController.getTourStats);
router
  .route('/monthlyplan/:year')
  .get(
    authController.protect,
    authController.restrictRole('admin', 'lead-guide', 'guide'),
    tourController.monthlyPlan,
  );
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictRole('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(authController.protect, tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictRole('admin', 'lead-guide'),
    tourController.uploadTours,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictRole('admin', 'lead-guide'),
    tourController.DeleteTour,
  );
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
module.exports = router;
