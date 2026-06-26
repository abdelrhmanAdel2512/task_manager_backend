'use strict';

const { body, query } = require('express-validator');
const { PROJECT_STATUSES } = require('../models/project.model');

// Create: all required fields enforced
const createProjectRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(PROJECT_STATUSES).withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),

  body('color')
    .trim()
    .notEmpty().withMessage('Color is required')
    .matches(/^0xFF[0-9A-Fa-f]{6}$/).withMessage('Color must be in format 0xFFRRGGBB'),

  body('stack')
    .optional()
    .isArray({ max: 10 }).withMessage('Stack must be an array of at most 10 items')
    .custom((arr) => arr.every((s) => typeof s === 'string' && s.length <= 30))
    .withMessage('Each stack item must be a string of at most 30 characters'),
];

// Update: all fields optional (partial update)
const updateProjectRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(PROJECT_STATUSES).withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),

  body('color')
    .optional()
    .trim()
    .matches(/^0xFF[0-9A-Fa-f]{6}$/).withMessage('Color must be in format 0xFFRRGGBB'),

  body('stack')
    .optional()
    .isArray({ max: 10 }).withMessage('Stack must be an array of at most 10 items')
    .custom((arr) => arr.every((s) => typeof s === 'string' && s.length <= 30))
    .withMessage('Each stack item must be a string of at most 30 characters'),
];

const listProjectsRules = [
  query('status').optional().isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = { createProjectRules, updateProjectRules, listProjectsRules };
