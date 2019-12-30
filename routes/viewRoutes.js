const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protectRoute, viewsController.getAccount);
router.get(
  '/my-tours',
  authController.protectRoute,
  viewsController.getMyTours
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.post(
  '/submit-user-data',
  authController.protectRoute,
  viewsController.updateUserData
);

router.route('/error').post(viewsController.logClientError);

module.exports = router;
