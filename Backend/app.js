const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorConroller');
const TourRoute = require('./routes/tourRoutes');
const UserRoute = require('./routes/userRoutes');
const ReviewRoute = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const app = express();

const FRONTEND_ORIGIN = 'https://natours-zeta-peach.vercel.app';

// CORS Middleware (allow requests from your frontend only)
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);

// Cookie parser middleware (only once)
app.use(cookieParser());

// Serve static image files from /img with CORS headers allowing frontend access
app.use(
  '/img',
  express.static(path.join(__dirname, 'public', 'img'), {
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Optional but recommended for cross-origin images
    },
  }),
);

// Security HTTP headers
app.use(helmet());

// Dev logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter middleware - limit requests to API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
});
app.use('/api', limiter);

// Webhook for booking checkout
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webHooksCheckOut,
);

// Body parser middleware: parse JSON body with 10kb limit
app.use(express.json({ limit: '10kb' }));

// Prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Set view engine (using Pug here)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve other static files (like CSS/JS) from /public
app.use(express.static(path.join(__dirname, 'public')));

// Test route to render a base template
app.get('/', (req, res) => {
  res.status(200).render('base');
});

// API routes
app.use('/api/v1/tours', TourRoute);
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/review', ReviewRoute);
app.use('/api/v1/bookings', bookingRouter);

// Handle all unhandled routes with 404 error
app.all('/*any', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
