const express = require('express');
const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../../controllers/notificationController'); // ✅ adjust path if needed

const { auth, isAdmin } = require('../../middleware/auth'); // ✅ adjust path if needed

// ✅ Admin sends global notification
router.post('/admin/notifications', auth, isAdmin, createNotification);

// ✅ User gets notifications list
router.get('/notifications', auth, getNotifications);

// ✅ User gets unread count only
router.get('/notifications/unread-count', auth, getUnreadCount);

// ✅ User marks one notification as read
router.post('/notifications/read', auth, markAsRead);

// ✅ User marks all as read
router.post('/notifications/read-all', auth, markAllAsRead);

module.exports = router;
