const express = require('express');
const router = express.Router();
const userDB = require('../../models/user/user');
const { sendEmail } = require('../../config/emailConfig');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const user = await userDB.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Send email to all users (admin only)
router.post('/send-to-all', isAdmin, async (req, res) => {
    try {
        const { subject, text, html } = req.body;

        // Validate required fields
        if (!subject || !text || !html) {
            return res.status(400).json({
                success: false,
                message: 'Subject, text, and HTML content are required'
            });
        }

        // Get all non-deleted users
        const users = await userDB.find({ isDeleted: false });

        let successCount = 0;
        let failureCount = 0;
        const failedEmails = [];

        // Send emails to all users
        for (const user of users) {
            try {
                console.log(`Sending email to: ${user.email}`);
                await sendEmail(user.email, subject, text, html);
                successCount++;
                
                // Add a small delay between emails to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Failed to send email to ${user.email}:`, error);
                failureCount++;
                failedEmails.push({
                    email: user.email,
                    error: error.message
                });
            }
        }

        return res.status(200).json({
            success: true,
            summary: {
                totalUsers: users.length,
                successCount,
                failureCount,
                failedEmails
            }
        });

    } catch (err) {
        console.error('Error in mass email:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router; 