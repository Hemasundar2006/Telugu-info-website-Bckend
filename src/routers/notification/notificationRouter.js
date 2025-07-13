const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
} = require("../../controllers/notificationController");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }
};

// Admin routes
router.post("/admin/notifications", auth, isAdmin, createNotification);

// User routes
router.get("/notifications", auth, getNotifications);
router.post("/notifications/read", auth, markAsRead);
router.post("/notifications/read-all", auth, markAllAsRead);
router.get("/notifications/unread-count", auth, getUnreadCount);

module.exports = router;