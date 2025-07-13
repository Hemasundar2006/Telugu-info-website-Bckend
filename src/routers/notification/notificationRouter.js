const express = require('express');
const router = express.Router();

const { auth, isAdmin } = require('../../middlewares/authMiddleware');
const {
  createNotification,
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead
} = require('../../controllers/notificationController');

// ✅ Admin creates notification
router.post("/admin/notifications", auth, isAdmin, createNotification);

// ✅ Get all notifications for the logged-in user
router.get("/notifications", auth, getNotifications);

// ✅ Get unread notification count for the logged-in user
router.get("/notifications/unread-count", auth, getUnreadCount);

// ✅ Mark a notification as read
router.post("/notifications/read", auth, markNotificationRead);

// ✅ Mark all notifications as read
router.post("/notifications/read-all", auth, markAllNotificationsRead);

module.exports = router;
