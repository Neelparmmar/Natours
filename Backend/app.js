const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
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
app.use(
  cors({
    origin: 'https://natours-zeta-peach.vercel.app',
    credentials: true,
  }),
);

// app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

// 1. Set Security HTTP headers
app.use(helmet());

// 2. Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. Rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webHooksCheckOut,
);
// 4. Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// 5. Data sanitization
// app.use(mongoSanitize());
// app.use(xss());

// 6. Prevent parameter pollution
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

// 7. Set view engine and views path
app.set('view engine', 'pug'); // or your template engine
app.set('views', path.join(__dirname, 'views'));

// 8. Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/img/users', (req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://natours-zeta-peach.vercel.app',
  );
  next();
});
// 9. Test route
app.get('/', (req, res) => {
  res.status(200).render('base');
});

// 10. Routes
app.use('/api/v1/tours', TourRoute);
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/review', ReviewRoute);
app.use('/api/v1/bookings', bookingRouter);

// 11. Handle unhandled routes
app.all('/*any', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 12. Global error handler
app.use(globalErrorHandler);

module.exports = app;
