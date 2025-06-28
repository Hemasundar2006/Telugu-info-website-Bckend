const express = require('express');
const { forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 */
router.post('/reset-password/:token', resetPassword);

module.exports = router;
