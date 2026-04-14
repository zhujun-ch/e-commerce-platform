/**
 * Error Handling Middleware
 *
 * Catches all errors and returns consistent JSON error responses.
 * Supports different error types: validation, auth, not found, server error
 *
 * Usage: app.use(errorHandler)
 */

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let type = err.type || 'server_error';

  // Handle specific error types
  switch (err.type) {
    case 'validation_error':
      statusCode = 400;
      type = 'validation_error';
      break;

    case 'auth_error':
    case 'unauthorized':
      statusCode = 401;
      type = 'auth_error';
      break;

    case 'forbidden':
      statusCode = 403;
      type = 'forbidden';
      break;

    case 'not_found':
      statusCode = 404;
      type = 'not_found';
      break;

    case 'conflict':
      statusCode = 409;
      type = 'conflict';
      break;

    case 'server_error':
    default:
      // Already set to 500 by default
      break;
  }

  // Handle specific status codes from errors
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  // Express-validator errors
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = err.array();
    type = 'validation_error';
  }

  // Mongoose/DB validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    type = 'validation_error';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
    type = 'auth_error';
  }

  // Send consistent error response
  res.status(statusCode).json({
    error: {
      type,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Custom Error class for typed errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, type = 'server_error') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Error.captureStackTrace(this, this.constructor);
  }

  static validation(message) {
    return new AppError(message, 400, 'validation_error');
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401, 'auth_error');
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403, 'forbidden');
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404, 'not_found');
  }

  static conflict(message = 'Conflict') {
    return new AppError(message, 409, 'conflict');
  }

  static server(message = 'Internal server error') {
    return new AppError(message, 500, 'server_error');
  }
}

module.exports = {
  errorHandler,
  AppError
};
