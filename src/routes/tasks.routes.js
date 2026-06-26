'use strict';

const router = require('express').Router({ mergeParams: true }); // inherit :projectId from parent
const controller = require('../controllers/tasks.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createTaskRules,
  updateTaskRules,
  statusChangeRules,
  listTasksRules,
} = require('../validators/tasks.validator');

// All task routes require authentication
router.use(protect);

router.route('/')
  .get(listTasksRules, validate, controller.listTasks)
  .post(createTaskRules, validate, controller.createTask);

router.route('/:taskId')
  .get(controller.getTask)
  .put(updateTaskRules, validate, controller.updateTask)
  .delete(controller.deleteTask);

// Dedicated status-change endpoint
router.patch('/:taskId/status', statusChangeRules, validate, controller.changeTaskStatus);

module.exports = router;
