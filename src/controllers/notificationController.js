const Notification = require('../models/notification/notification');

// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { title, message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is required' 
            });
        }

        const notification = new Notification({
            title,
            message,
            isGlobal: true,
            createdBy: req.user.id
        });

        await notification.save();

        // Emit via Socket.IO if available
        const io = req.app.get('io');
        if (io) {
            io.emit('new-notification', { notification });
        }

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating notification',
            error: error.message
        });
    }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [
                { isGlobal: true },
                { readBy: { $ne: req.user.id } }
            ]
        })
        .sort({ createdAt: -1 })
        .limit(50);

        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { readBy: req.user.id } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            $or: [
                { isGlobal: true },
                { readBy: { $ne: req.user.id } }
            ]
        });

        res.json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting unread count',
            error: error.message
        });
    }
};