'use strict';

const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });

  ApiResponse.created(res, {
    user: result.user,
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_in: result.expires_in,
  }, 'Account created successfully');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  ApiResponse.ok(res, {
    user: result.user,
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_in: result.expires_in,
  }, 'Login successful');
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh({ refresh_token: req.body.refresh_token });
  ApiResponse.ok(res, result);
});

const logout = asyncHandler(async (_req, res) => {
  // Token blacklisting can be added here (Redis) when needed
  ApiResponse.ok(res, null, 'Logged out successfully');
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  ApiResponse.ok(res, user);
});

module.exports = { register, login, refresh, logout, getMe };
