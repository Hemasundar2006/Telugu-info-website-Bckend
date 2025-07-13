const Notification = require('../models/notification/notification');
const User = require('../models/user/user');

// Create a new notification (Admin only)
exports.createNotification = async (req, res) => {
    try {
        const {
            title,
            message,
            notificationType,
            priority,
            targetAudience,
            isUrgent,
            allowComments,
            actionText,
            actionLink,
            scheduledDate,
            scheduledTime,
            isScheduled
        } = req.body;

        // Validation
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        if (message.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Message must be less than 500 characters'
            });
        }

        if (actionText && !actionLink) {
            return res.status(400).json({
                success: false,
                message: 'Action link is required when action text is provided'
            });
        }

        if (isScheduled && !scheduledDate) {
            return res.status(400).json({
                success: false,
                message: 'Scheduled date is required when scheduling is enabled'
            });
        }

        // Create notification
        const notificationData = {
            title: title?.trim() || undefined,
            message: message.trim(),
            notificationType: notificationType || 'general',
            priority: priority || 'normal',
            targetAudience: targetAudience || 'all',
            isUrgent: isUrgent || false,
            allowComments: allowComments || false,
            actionText: actionText?.trim() || undefined,
            actionLink: actionLink?.trim() || undefined,
            scheduledDate: isScheduled ? new Date(scheduledDate) : undefined,
            scheduledTime: isScheduled ? scheduledTime : undefined,
            isScheduled: isScheduled || false,
            isSent: !isScheduled, // If not scheduled, mark as sent immediately
            sentAt: !isScheduled ? new Date() : undefined,
            createdBy: req.user._id
        };

        const notification = new Notification(notificationData);
        await notification.save();

        // If not scheduled, send immediately
        if (!isScheduled) {
            // Emit via Socket.IO if available
            const io = req.app.get('io');
            if (io) {
                io.emit('new-notification', { notification });
            }
        }

        res.status(201).json({
            success: true,
            message: isScheduled ? 'Notification scheduled successfully' : 'Notification sent successfully',
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
        const { page = 1, limit = 20, type, priority } = req.query;
        const skip = (page - 1) * limit;

        let query = {
            $or: [
                { isGlobal: true },
                { readBy: { $ne: req.user._id } }
            ]
        };

        // Filter by target audience
        if (req.user.role === 'admin') {
            // Admins can see all notifications
        } else if (req.user.role === 'premium') {
            query.targetAudience = { $in: ['all', 'registered', 'premium'] };
        } else {
            query.targetAudience = { $in: ['all', 'registered'] };
        }

        // Additional filters
        if (type) query.notificationType = type;
        if (priority) query.priority = priority;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'name email');

        const total = await Notification.countDocuments(query);

        res.json({
            success: true,
            notifications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalNotifications: total,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
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

// Get admin notifications (for admin dashboard)
exports.getAdminNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, type } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        if (status === 'scheduled') {
            query.isScheduled = true;
            query.isSent = false;
        } else if (status === 'sent') {
            query.isSent = true;
        }

        if (type) query.notificationType = type;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'name email');

        const total = await Notification.countDocuments(query);

        res.json({
            success: true,
            notifications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalNotifications: total,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching admin notifications:', error);
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
        
        if (!notificationId) {
            return res.status(400).json({
                success: false,
                message: 'Notification ID is required'
            });
        }

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { readBy: req.user._id } },
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

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { readBy: { $ne: req.user._id } },
            { $addToSet: { readBy: req.user._id } }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read',
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notifications as read',
            error: error.message
        });
    }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
    try {
        let query = {
            $or: [
                { isGlobal: true },
                { readBy: { $ne: req.user._id } }
            ]
        };

        // Filter by target audience
        if (req.user.role === 'admin') {
            // Admins can see all notifications
        } else if (req.user.role === 'premium') {
            query.targetAudience = { $in: ['all', 'registered', 'premium'] };
        } else {
            query.targetAudience = { $in: ['all', 'registered'] };
        }

        const count = await Notification.countDocuments(query);

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

// Delete notification (Admin only)
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

// Update notification (Admin only)
exports.updateNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated
        delete updateData.createdBy;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification updated successfully',
            notification
        });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification',
            error: error.message
        });
    }
};