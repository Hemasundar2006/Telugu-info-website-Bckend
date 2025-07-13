const Notification = require("../models/notification/notification");
const User = require("../models/user/user");

// Create a new notification (Admin only)
const createNotification = async (req, res) => {
    try {
        const { message } = req.body;
        const adminId = req.user.id; // Assuming you have auth middleware

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const notification = new Notification({
            message: message.trim(),
            isGlobal: true,
            createdBy: adminId
        });

        await notification.save();

        // Emit real-time notification to all connected clients
        const io = req.app.get('io');
        if (io) {
            io.emit('new-notification', {
                notification: {
                    _id: notification._id,
                    message: notification.message,
                    createdAt: notification.createdAt,
                    isGlobal: notification.isGlobal
                }
            });
        }

        res.status(201).json({
            success: true,
            message: "Notification sent successfully",
            notification
        });

    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create notification",
            error: error.message
        });
    }
};

// Get notifications for a user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ isGlobal: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'name email');

        // Get unread count
        const unreadCount = await Notification.countDocuments({
            isGlobal: true,
            readBy: { $ne: userId }
        });

        res.json({
            success: true,
            notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: await Notification.countDocuments({ isGlobal: true })
            }
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.body;

        if (!notificationId) {
            return res.status(400).json({
                success: false,
                message: "Notification ID is required"
            });
        }

        const notification = await Notification.findById(notificationId);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Add user to readBy array if not already there
        if (!notification.readBy.includes(userId)) {
            notification.readBy.push(userId);
            await notification.save();
        }

        // Get updated unread count
        const unreadCount = await Notification.countDocuments({
            isGlobal: true,
            readBy: { $ne: userId }
        });

        res.json({
            success: true,
            message: "Notification marked as read",
            unreadCount
        });

    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { 
                isGlobal: true,
                readBy: { $ne: userId }
            },
            { $push: { readBy: userId } }
        );

        res.json({
            success: true,
            message: "All notifications marked as read",
            unreadCount: 0
        });

    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read",
            error: error.message
        });
    }
};

// Get unread count only
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const unreadCount = await Notification.countDocuments({
            isGlobal: true,
            readBy: { $ne: userId }
        });

        res.json({
            success: true,
            unreadCount
        });

    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch unread count",
            error: error.message
        });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
}; 