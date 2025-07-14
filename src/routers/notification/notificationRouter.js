const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  createNotification,
  getNotifications,
  getAdminNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  updateNotification
} = require('../../controllers/notificationController');

const { auth, isAdmin } = require('../../middleware/auth');

// Validation middleware
const validateNotification = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message is required and must be less than 500 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('notificationType')
    .optional()
    .isIn(['general', 'announcement', 'update', 'alert', 'reminder'])
    .withMessage('Invalid notification type'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('targetAudience')
    .optional()
    .isIn(['all', 'registered', 'premium', 'admin'])
    .withMessage('Invalid target audience'),
  body('actionLink')
    .optional()
    .isURL()
    .withMessage('Invalid action link URL')
];

// ✅ Admin routes — mounted under /api/admin
router.post('/notifications', auth, isAdmin, validateNotification, createNotification);
router.get('/notifications', auth, isAdmin, getAdminNotifications);
router.delete('/notifications/:notificationId', auth, isAdmin, deleteNotification);
router.put('/notifications/:notificationId', auth, isAdmin, validateNotification, updateNotification);

// ✅ User routes — these still work under /api/admin/notifications/user/*
router.get('/notifications/user', auth, getNotifications);
router.get('/notifications/user/unread-count', auth, getUnreadCount);
router.post('/notifications/user/read', auth, markAsRead);
router.post('/notifications/user/read-all', auth, markAllAsRead);

module.exports = router;
