const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide", "guide"),
    tourController.getMonthlyPlan
  );

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    tourController.createTour
  );

router
  .route(`/:id`)
  .get(tourController.getTour)
  .patch(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    tourController.validateId,
    tourController.updateTour
  )
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    tourController.validateId,
    tourController.deleteTour
  );

module.exports = router;
