'use strict';

const router = require('express').Router();
const statsController = require('../controllers/stats.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// GET /v1/stats
router.get('/', requireAuth, statsController.getStats);

module.exports = router;
