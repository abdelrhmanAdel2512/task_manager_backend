'use strict';

const router = require('express').Router();
const controller = require('../controllers/tasks.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { listTasksRules } = require('../validators/tasks.validator');

// All task routes require authentication
router.use(protect);

router.route('/')
  .get(listTasksRules, validate, controller.listAllTasks);

module.exports = router;
