const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const { catchAsync } = require('../utils');
const factory = require('./handlerFactory');

exports.createBooking = factory.createOne({ Booking });
exports.getBooking = factory.getOne({ Booking });
exports.getAllBookings = factory.getAll({ Booking });
exports.updateBooking = factory.updateOne({ Booking });
exports.deleteBooking = factory.deleteOne({ Booking });

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${baseUrl}/my-tours`,
    cancel_url: `${baseUrl}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`${baseUrl}/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

// Create a new booking using the data that gets back from stripe
const createBookingCheckout = async session => {
  // client_reference_id, customer_email, display_items (same as line_items) are specified above in session under getCheckoutSession middleware ⬆
  if (
    (session.client_reference_id &&
      session.customer_email &&
      session.display_items &&
      session.display_items.length &&
      session.display_items[0] &&
      session.display_items[0].amount !== null) ||
    session.display_items[0].amount !== undefined
  ) {
    const tourId = session.client_reference_id;
    const userId = (await User.findOne({ email: session.customer_email })).id;
    const price = session.display_items[0].amount / 100;
    await Booking.create({ tour: tourId, user: userId, price });
  }
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

/* This createBookingCheckout is not needed because currently we're using stripe webhooks with above defiled webhookCheckout middleware.
However, if not for that, we would want to use this middleware. This middleware is not 
secure because anyone who knows the stripe success endpoint, could create a booking
without providing a payment. If you still want to use it, then modify viewRoutes.js route to look like this:
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
Also, to use this middleware, modify the success_url in getCheckoutSession middleware above to look like this:
  success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    req.params.tourId
  }&user=${req.user.id}&price=${tour.price}`,
 */
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();

//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });