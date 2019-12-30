const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const {
  toMilliseconds,
  AppError,
  onMaliciousActivity,
  blockBlacklistedIps
} = require('./utils');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewsRouter = require('./routes/viewRoutes');
const tourShape = require('./models/shapes/tourShape');

const app = express();

// Trust proxies (this is how horoku and some other servers do stuff)
app.enable('trust proxy');

// Set up Pug views engine 🐶
app.set('view engine', 'pug');

// Point views to views folder
app.set('views', path.join(__dirname, 'views'));

/*===================*/
/* GLOBAL MIDDLEWARE */
/*===================*/

// !!! CORS for simple requests only! for GET and POST !!!
// Implement CORS to allow everyone to send requests to your server
app.use(cors());
/* If you instead only want a particular endpoint send request to your server,
You can set up CORS in the following way: */
// app.use(cors({
//   origin: 'https://www.yourtravelportal.com'
// }));

// !!! CORS for none-simple (DELETE, PUT etc..) requests !!!
/* When a none-simple request is send, user agent first sends a "pre-flight phase"
which is an OPTIONS request to your server.
So, in order for CORS to work in those cases, you need to handle OPTIONS
request and send the "Access-Control-Allow-Origin headers back:" */
app.options('*', cors());

// Serving static files in /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging to console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: toMilliseconds('1 hour'),
  message: 'Too many requests from this IP, please try again in an hour.'
});
app.use('/api', limiter);

/* Endpoint for Stripe to post all data about transaction
The reason why this route is defined here in app.js is because
whatever data that stripe will post to this route needs to come
in a raw format, and NOT a JSON format. The next middleware (express.json...)
will parse bodies of HTTP requests as JSON, so this middleware route
needs to go before express.json
*/
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Body parser - reading data from http body into req.body and limiting it
// If data is more that the set limit, it will not be accepted
app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parse data from cookies 🍪
app.use(cookieParser());

// Data sanitization agains NoSQL query injection
app.use(mongoSanitize({}, onMaliciousActivity));

// Data sanitization agains XSS attacks
// Prevent cross site scripting by replacing html special characters with something else: <script => &lt;script
app.use(xss());

// Prevent http pollution when same search query strings are passed: e.g. ?sort=x&sort=y
// By whitelisting prop names, you would allow those that are whitelisted to be listed twice
// For example, this will return results with duration of 5 and 9 because duration is whitelisted ...?duration=5&duration=9
// Without whitelisting 'duration', the result will only be the last duration - 9
app.use(hpp({ whitelist: Object.keys(tourShape) }));

// Compress all text that is sent to client
app.use(compression());

// Testing middleware. You can access and examine request.
app.use((req, res, next) => {
  // Add time of request to req object (request)
  req.requestTime = new Date().toISOString();
  next();
});

// // Other way of loading configs. This one will run at each request, so there is another one at app.listen that runs only once
// app.use(async function (req, res, next) {
//   const configs = await Configs.find();
//   req.app.set('configs', configs);
//   console.log('LOADED CONFIGS = ', configs);
//   next();
// });

// Check configs object in database for list of blacklisted IP addresses and
// generate an error if IP is blacklisted
app.use(blockBlacklistedIps);

/*========*/
/* ROUTES */
/*========*/

// Templates Routes
app.use('/', viewsRouter);

// API Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
// If none of the routes matched, apply catch all route and generate an error
app.all('*', (req, res, next) => {
  next(
    new AppError(`Cat't find ${req.originalUrl} on this server.`, 404, 'A-01')
  );
});

/*================*/
/* ERROR HANDLERS */
/*================*/

// If there are any errors, run them through error handlers in errorControllers.js
app.use(globalErrorHandler);

module.exports = app;
