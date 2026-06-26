'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

// ── Token generators ──────────────────────────────────────────────────────────

const signAccessToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  });

const signRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

const buildTokenPair = (userId) => ({
  access_token: signAccessToken(userId),
  refresh_token: signRefreshToken(userId),
  expires_in: 86400,
});

// ── Service methods ───────────────────────────────────────────────────────────

const register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw ApiError.conflict('A user with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const tokens = buildTokenPair(user._id);

  return { user, ...tokens };
};

const login = async ({ email, password }) => {
  // Select password explicitly since it's hidden by default
  const user = await User.findOne({ email }).select('+password');

  // Deliberately vague: don't reveal whether email or password was wrong
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const tokens = buildTokenPair(user._id);
  return { user, ...tokens };
};

const refresh = async ({ refresh_token }) => {
  let decoded;
  try {
    decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw ApiError.invalidToken('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw ApiError.invalidToken('User no longer exists');
  }

  return {
    access_token: signAccessToken(user._id),
    expires_in: 86400,
  };
};

const getMe = async (userId) => User.findById(userId);

module.exports = { register, login, refresh, getMe };
