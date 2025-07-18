const express = require('express');
const router = express.Router();
const Notification = require('../models/notification/notification'); // Adjust path as needed

// POST /api/admin/notifications
const { body, validationResult } = require('express-validator');

router.post('/notifications', 
    [
        body('title').trim().isLength({ min: 3 }).optional(),
        body('message').trim().isLength({ min: 5 }).notEmpty(),
        auth,
        isAdmin
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { title, message } = req.body;
            const notification = new Notification({
                title,
                message,
                isGlobal: true,
                createdBy: req.user.id
            });

            await notification.save();

            const io = req.app.get('io');
            if (io) {
                io.emit('new-notification', {
                    notification: notification.toJSON()
                });
            }

            res.json({
                success: true,
                message: 'Notification sent',
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
    }
);
  const { title, message } = req.body;

  if (!message && !title) {
    return res.status(400).json({ success: false, message: 'Message or title is required' });
  }

  // Combine title and message if both are present
  const fullMessage = title ? (title + (message ? ': ' + message : '')) : message;

  try {
    // Save to DB
    const notification = new Notification({
      message: fullMessage,
      isGlobal: true,
      createdBy: req.user ? req.user.id : null // If you have auth, otherwise remove this
    });
    await notification.save();

    // Emit to all clients via Socket.IO if available
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

    res.json({ success: true, message: 'Notification sent', notification });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ success: false, message: 'Error sending notification', error: err.message });
  }
});

module.exports = router; 