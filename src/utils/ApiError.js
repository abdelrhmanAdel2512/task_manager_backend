'use strict';

/**
 * Operational (expected) API error.
 * Extends Error so it can be thrown anywhere and caught by the error middleware.
 *
 * Usage:
 *   throw new ApiError(404, 'NOT_FOUND', 'Project not found');
 *   throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid input', [{ field: 'name', message: '...' }]);
 */
class ApiError extends Error {
  /**
   * @param {number}   statusCode  HTTP status code
   * @param {string}   code        Machine-readable error code (snake_upper)
   * @param {string}   message     Human-readable message
   * @param {Array}    [details]   Field-level validation details
   */
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // distinguish from programmer errors

    Error.captureStackTrace(this, this.constructor);
  }

  // ── Factory shortcuts ──────────────────────────────────────────────────────

  static badRequest(message, details = []) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'You do not have permission to perform this action') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(resource = 'Resource') {
    return new ApiError(404, 'NOT_FOUND', `${resource} not found`);
  }

  static conflict(message) {
    return new ApiError(409, 'DUPLICATE_RESOURCE', message);
  }

  static invalidToken(message = 'Invalid or expired token') {
    return new ApiError(401, 'INVALID_TOKEN', message);
  }
}

module.exports = ApiError;
