const express = require('express');
const router = express.Router();
const notificationRouter = require('./notification/notificationRouter');
const adminRouter = require('./admin/adminRouter');
const { auth, isAdmin } = require('../middleware/auth');

// User routes
router.use('/api', notificationRouter);

// Admin routes
router.use('/api/admin', auth, isAdmin, adminRouter);

module.exports = router;