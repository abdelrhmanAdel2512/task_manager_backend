'use strict';

const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator rule arrays.
 * If any rule failed, collects field-level errors and throws a 400 ApiError.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
    }));
    throw ApiError.badRequest('Validation failed', details);
  }

  next();
};

module.exports = { validate };
