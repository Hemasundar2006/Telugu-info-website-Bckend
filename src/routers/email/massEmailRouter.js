const express = require('express');
const router = express.Router();
const userDB = require('../../models/user/user');
const { sendEmail } = require('../../config/emailConfig');

// Test endpoint to check user count and send a test email
router.post('/test-email', async (req, res) => {
    try {
        console.log('Test email endpoint called');
        
        // Get all non-deleted users
        const users = await userDB.find({ isDeleted: false });
        console.log(`Found ${users.length} total users`);

        // Send test email to the specified test email address
        const testEmail = req.body.testEmail;
        if (!testEmail) {
            return res.status(400).json({
                success: false,
                message: 'Test email address is required'
            });
        }

        console.log(`Sending test email to: ${testEmail}`);

        // Send a test email
        const testResult = await sendEmail(
            testEmail,
            "Test Email from Telugu Info",
            "This is a test email to verify the mass email system is working.",
            `<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1>Test Email</h1>
                <p>This is a test email to verify the mass email system is working.</p>
                <p>System Status:</p>
                <ul>
                    <li>Total users in database: ${users.length}</li>
                    <li>Email system: Active</li>
                    <li>Test time: ${new Date().toLocaleString()}</li>
                </ul>
            </div>`
        );

        console.log('Test email result:', testResult);

        return res.status(200).json({
            success: true,
            userCount: users.length,
            emailTestResult: testResult,
            message: 'Test completed successfully'
        });

    } catch (err) {
        console.error('Error in test email:', err);
        return res.status(500).json({ 
            success: false, 
            message: err.message,
            error: err.toString()
        });
    }
});

// Send email to all users
router.post('/send-to-all', async (req, res) => {
    try {
        console.log('Send to all endpoint called');
        console.log('Request body:', req.body);
        
        const { subject, text, html } = req.body;

        // Validate required fields
        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'Subject is required'
            });
        }

        if (!text && !html) {
            return res.status(400).json({
                success: false,
                message: 'Either text or html content is required'
            });
        }

        // Get all non-deleted users
        const users = await userDB.find({ isDeleted: false });
        
        console.log(`Found ${users.length} users to send emails to`);

        if (users.length === 0) {
            return res.status(200).json({
                success: true,
                summary: {
                    totalUsers: 0,
                    successCount: 0,
                    failureCount: 0,
                    failedEmails: []
                },
                message: 'No users found to send emails to'
            });
        }

        let successCount = 0;
        let failureCount = 0;
        const failedEmails = [];

        // Send emails to all users
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            try {
                console.log(`[${i + 1}/${users.length}] Sending email to: ${user.email}`);
                
                const result = await sendEmail(
                    user.email, 
                    subject, 
                    text || 'Please view this email in HTML format', 
                    html || text
                );
                
                if (result.success) {
                    successCount++;
                    console.log(`✅ Successfully sent to: ${user.email}`);
                } else {
                    failureCount++;
                    failedEmails.push({
                        email: user.email,
                        error: result.error || 'Unknown error'
                    });
                    console.error(`❌ Failed to send to ${user.email}: ${result.error}`);
                }
                
                // Add delay between emails to avoid rate limiting
                if (i < users.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (error) {
                console.error(`❌ Exception sending to ${user.email}:`, error);
                failureCount++;
                failedEmails.push({
                    email: user.email,
                    error: error.message || 'Exception occurred'
                });
            }
        }

        const summary = {
            totalUsers: users.length,
            successCount,
            failureCount,
            failedEmails
        };

        console.log('Email sending completed:', summary);

        return res.status(200).json({
            success: true,
            summary: summary,
            message: `Email sending completed. ${successCount} sent, ${failureCount} failed.`
        });

    } catch (err) {
        console.error('Error in mass email:', err);
        return res.status(500).json({ 
            success: false, 
            message: err.message || 'Internal server error',
            error: err.toString()
        });
    }
});

module.exports = router; 