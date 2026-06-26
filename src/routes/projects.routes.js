'use strict';

const router = require('express').Router();
const controller = require('../controllers/projects.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createProjectRules,
  updateProjectRules,
  listProjectsRules,
} = require('../validators/projects.validator');

// All project routes require authentication
router.use(protect);

router.route('/')
  .get(listProjectsRules, validate, controller.listProjects)
  .post(createProjectRules, validate, controller.createProject);

router.route('/:id')
  .get(controller.getProject)
  .put(updateProjectRules, validate, controller.updateProject)
  .delete(controller.deleteProject);

module.exports = router;
