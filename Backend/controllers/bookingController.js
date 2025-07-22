const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
// const ApiError = require('../utils/appError');
const factory = require('./handleFactory');
const User = require('../models/userModel');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment', // <== Required by modern API
    success_url: `${process.env.FRONTEND_BASE_URL}/my-booking`,
    cancel_url: `${process.env.FRONTEND_BASE_URL}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100, // in cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  // 3) Send session to client
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingcheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100; // ✅ Use amount_total instead of line_items (not available by default)

  await Booking.create({ tour, user, price });
};

exports.webHooksCheckOut = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET, // ✅ FIXED
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    await createBookingcheckout(event.data.object); // ✅ await to handle async properly
  }

  res.status(200).json({ received: true });
};

exports.getMyTour = async (req, res, next) => {
  try {
    // 1) Find all bookings for the current user
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Extract tour IDs from those bookings
    const tourIds = bookings.map((el) => el.tour);

    // 3) Find tours using those tour IDs
    const tours = await Tour.find({ _id: { $in: tourIds } });

    // 4) Send tours to client
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllBooking = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
