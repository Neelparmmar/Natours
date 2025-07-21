const ApiError = require('../utils/appError');

// Handle invalid MongoDB ObjectId
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};
const handleDuplicateError = (err) => {
  // Extract duplicated field value using regex
  // const matches = err.message.match(/(["'])(\\?.)*?\1/);
  // const value = matches ? matches[0] : '<duplicate value>';

  const message = `Duplicate field value '${err.keyValue.name}': please use another value`;
  return new ApiError(message, 400);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid inputs ${errors.join('. ')}`;
  return new ApiError(message, 400);
};
const handleJwtError = () => {
  const message = 'invalid token please log in again';
  return new ApiError(message, 400);
};
const handleJwtExpiredError = () =>
  new ApiError('Token is expired. please login again', 401);

// Send detailed error in development
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res
      .status(err.statusCode)
      .json({ status: 'error', message: 'Something Went Wrong' });
  }
};

// Send friendly error in production
const sendErrorProd = (err, req, res) => {
  // Operational/trusted error
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or unknown error: log it & send generic message
    // console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 🔥 Corrected spelling from "developement" to "development"
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    // 🧠 Fix for missing `message` when spreading `err` object
    error.message = err.message;

    // Handle MongoDB CastError
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJwtExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
