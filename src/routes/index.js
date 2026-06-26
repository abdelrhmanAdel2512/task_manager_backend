'use strict';

const router = require('express').Router();

const authRoutes    = require('./auth.routes');
const projectRoutes = require('./projects.routes');
const taskRoutes    = require('./tasks.routes');

// Mount routers
router.use('/auth',     authRoutes);
router.use('/projects', projectRoutes);

// Tasks are nested under projects: /projects/:projectId/tasks
router.use('/projects/:projectId/tasks', taskRoutes);

module.exports = router;
