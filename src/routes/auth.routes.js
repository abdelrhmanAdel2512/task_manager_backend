'use strict';

const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { registerRules, loginRules, refreshRules, logoutRules } = require('../validators/auth.validator');

// Public
router.post('/register', registerRules, validate, controller.register);
router.post('/login',    loginRules,    validate, controller.login);
router.post('/refresh',  refreshRules,  validate, controller.refresh);

// Protected
router.post('/logout', protect, logoutRules, validate, controller.logout);
router.get('/me',      protect, controller.getMe);

module.exports = router;
