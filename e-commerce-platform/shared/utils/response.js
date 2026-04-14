/**
 * Response Helper Functions
 *
 * Ensures consistent response format across all controllers.
 *
 * Usage:
 *   const { success, error, paginated } = require('../shared/utils/response');
 *
 *   success(res, { token, user }, 'Login successful', 201);
 *   error(res, 'Invalid credentials', 401, 'auth_error');
 *   paginated(res, products, { page, limit, total, pages });
 */

/**
 * Send successful response
 * @param {Object} res - Express response object
 * @param {*} data - Response data (can be object, array, or primitive)
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, data, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message
  };

  // If data is an object with pagination property, handle it specially
  if (data && typeof data === 'object' && data.pagination) {
    return res.status(statusCode).json({
      ...response,
      ...data
    });
  }

  // If data is primitive or array, wrap it
  if (data === null || data === undefined || typeof data !== 'object') {
    response.data = data;
  } else {
    // Merge data directly
    Object.assign(response, data);
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} type - Error type for client handling (default: 'server_error')
 */
const error = (res, message, statusCode = 500, type = 'server_error') => {
  return res.status(statusCode).json({
    success: false,
    error: {
      type,
      message
    }
  });
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items for current page
 * @param {Object} pagination - Pagination info
 * @param {number} pagination.page - Current page number
 * @param {number} pagination.limit - Items per page
 * @param {number} pagination.total - Total number of items
 * @param {number} pagination.pages - Total number of pages
 * @param {string} message - Success message (default: 'Success')
 */
const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: pagination.pages
    }
  });
};

module.exports = {
  success,
  error,
  paginated
};
