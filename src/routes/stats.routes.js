'use strict';

const router = require('express').Router();
const statsController = require('../controllers/stats.controller');
const { protect } = require('../middlewares/auth.middleware');

// GET /v1/stats
router.get('/', protect, statsController.getStats);

module.exports = router;
