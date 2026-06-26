'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Verifies the Bearer token from the Authorization header.
 * Attaches the decoded user document to req.user.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.invalidToken('Access token has expired');
    }
    throw ApiError.invalidToken('Invalid access token');
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw ApiError.unauthorized('User belonging to this token no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { protect };
