'use strict';

const { body, query } = require('express-validator');
const { TASK_STATUSES, TASK_PRIORITIES } = require('../models/task.model');

// Create: all required fields enforced
const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2, max: 255 }).withMessage('Title must be 2–255 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),

  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(TASK_PRIORITIES).withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601().withMessage('Deadline must be a valid date'),
];

// Update: all fields optional
const updateTaskRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('Title must be 2–255 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),

  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES).withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601().withMessage('Deadline must be a valid date'),
];

// Status-only change
const statusChangeRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
];

const listTasksRules = [
  query('status').optional().isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  query('priority').optional().isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 200 }).withMessage('Limit must be between 1 and 200'),
];

module.exports = { createTaskRules, updateTaskRules, statusChangeRules, listTasksRules };
