const Notification = require('../models/notification/notification');
const cron = require('node-cron');

// Check and send scheduled notifications every minute
const checkScheduledNotifications = async () => {
    try {
        const now = new Date();
        
        // Find notifications that are scheduled and due to be sent
        const scheduledNotifications = await Notification.find({
            isScheduled: true,
            isSent: false,
            scheduledDate: { $lte: now }
        });

        for (const notification of scheduledNotifications) {
            // Mark as sent
            notification.isSent = true;
            notification.sentAt = now;
            await notification.save();

            // Emit via Socket.IO if available
            // Note: You'll need to set up Socket.IO in your app.js
            console.log(`Scheduled notification sent: ${notification.title || notification.message}`);
        }

        if (scheduledNotifications.length > 0) {
            console.log(`Sent ${scheduledNotifications.length} scheduled notifications`);
        }
    } catch (error) {
        console.error('Error processing scheduled notifications:', error);
    }
};

// Start the cron job
const startScheduledNotificationService = () => {
    // Check every minute
    cron.schedule('* * * * *', checkScheduledNotifications);
    console.log('Scheduled notification service started');
};

module.exports = {
    startScheduledNotificationService,
    checkScheduledNotifications
}; 