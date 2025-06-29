const express = require('express');
const router = express.Router();
const { sendEmail } = require('../config/emailConfig');

// Middleware to validate email format
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

router.post('/send-to-all', async (req, res) => {
    try {
        const { subject, text, html } = req.body;
        const result = await sendEmail(subject, text, html);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to handle newsletter subscriptions
router.post('/newsletter/subscribe', async (req, res) => {
    try {
        console.log('Received subscription request:', req.body);
        const { email } = req.body;

        // Validate email
        if (!email) {
            console.log('Email missing in request');
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Email content
        const subject = 'Thank You for subscribing to Telugu Info Website';
        const text = 'Thank you for subscribing to Telugu Info Website. We are excited to have you on board!';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Thank You for subscribing to Telugu Info Website</h1>
                <p style="color: #666; line-height: 1.6;">
                    Thank you for subscribing to Telugu Info Website. We are excited to have you on board!
                </p>
                <p style="color: #666; line-height: 1.6;">
                    You will now receive our latest updates and news directly in your inbox.
                </p>
                <div style="margin-top: 20px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
                    <p style="margin: 0; color: #666;">
                        If you did not subscribe to our newsletter, please ignore this email.
                    </p>
                </div>
            </div>
        `;

        console.log('Attempting to send subscription email to:', email);
        const result = await sendEmail(email, subject, text, html);

        if (result.success) {
            console.log('Subscription email sent successfully to:', email);
            res.status(200).json({
                success: true,
                message: 'Subscription confirmation sent successfully'
            });
        } else {
            console.error('Failed to send subscription email:', result.error);
            res.status(500).json({
                success: false,
                message: 'Failed to send subscription confirmation',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Unexpected error in newsletter subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'newsletter-api'
    });
});

// Route to send email
router.post('/send', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        // Validate required fields
        if (!to || !subject || (!text && !html)) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, subject, and either text or html content'
            });
        }

        const result = await sendEmail(to, subject, text, html);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Email sent successfully',
                info: result.info
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send email',
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router; 