'use strict';

const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * 404 handler — catches any request that fell through all routes.
 */
const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl}`));
};

/**
 * Global error handler — last middleware in the chain.
 * Formats all errors into the standard { success, error } envelope.
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || [];

  // ── Mongoose: duplicate key (e.g. unique email) ───────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';
    message = `A record with this ${field} already exists`;
    details = [{ field, message }];
  }

  // ── Mongoose: cast error (invalid ObjectId) ───────────────────────────────
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = `Invalid value for field: ${err.path}`;
  }

  // ── Mongoose: validation error ────────────────────────────────────────────
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ── Log non-operational errors as errors (programmer mistakes) ─────────────
  if (!err.isOperational) {
    logger.error(`[Unhandled Error] ${err.message}`, { stack: err.stack, url: req.originalUrl });
  }

  // ── In production, hide details of non-operational errors ────────────────
  if (!err.isOperational && process.env.NODE_ENV === 'production') {
    message = 'An unexpected error occurred';
    details = [];
  }

  return res.status(statusCode).json({
    success: false,
    error: { code, message, details },
  });
};

module.exports = { notFound, errorHandler };
