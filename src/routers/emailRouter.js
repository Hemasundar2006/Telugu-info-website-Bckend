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
        const subject = '🎯 Welcome to Telugu Info - Your Job & Exam Updates Subscription is Confirmed!';
        const text = `Thank you for subscribing to Telugu Info! We're excited to have you join our community of job seekers and students. You'll now receive our latest job notifications, exam details, and career opportunities directly in your inbox. Stay ahead in your career journey!`;
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Telugu Info</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f6f8;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f6f8;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <!-- Main Container -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); overflow: hidden;">
                                
                                <!-- Header Section with Logo -->
                                <tr>
                                    <td style="background: linear-gradient(120deg, #4A90E2 0%, #5C6BC0 100%); padding: 45px 30px; text-align: center;">
                                        <img src="https://telugu.info/logo.png" alt="Telugu Info Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: -0.5px;">
                                            Welcome to Telugu Info!
                                        </h1>
                                        <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 300;">
                                            Your Gateway to Career Success
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Welcome Message -->
                                <tr>
                                    <td style="padding: 40px 30px 20px;">
                                        <h2 style="margin: 0 0 25px 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                                            Your Journey Begins Here! 🚀
                                        </h2>
                                        
                                        <p style="margin: 0 0 25px 0; color: #444444; font-size: 17px; line-height: 1.7;">
                                            Thank you for joining <strong>Telugu Info</strong>! You've taken the first step towards transforming your career. Get ready to receive personalized updates that matter to you.
                                        </p>
                                    </td>
                                </tr>

                                <!-- What You'll Get Section -->
                                <tr>
                                    <td style="padding: 0 30px 30px;">
                                        <div style="background: #f8faff; border-radius: 12px; padding: 25px;">
                                            <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600;">
                                                🎯 What's in Store for You:
                                            </h3>
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <div style="display: flex; align-items: center;">
                                                            <span style="background: #4A90E2; border-radius: 50%; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px;">
                                                                <span style="color: #ffffff; font-size: 16px;">💼</span>
                                                            </span>
                                                            <span style="color: #444444; font-size: 16px;">Premium Job Alerts</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <div style="display: flex; align-items: center;">
                                                            <span style="background: #4A90E2; border-radius: 50%; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px;">
                                                                <span style="color: #ffffff; font-size: 16px;">📝</span>
                                                            </span>
                                                            <span style="color: #444444; font-size: 16px;">Exam Updates & Notifications</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <div style="display: flex; align-items: center;">
                                                            <span style="background: #4A90E2; border-radius: 50%; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px;">
                                                                <span style="color: #ffffff; font-size: 16px;">🎓</span>
                                                            </span>
                                                            <span style="color: #444444; font-size: 16px;">Educational Resources</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>

                                <!-- CTA Section -->
                                <tr>
                                    <td style="padding: 20px 30px 40px;">
                                        <div style="text-align: center;">
                                            <a href="https://telugu-info.vercel.app/" style="display: inline-block; background: linear-gradient(120deg, #4A90E2 0%, #5C6BC0 100%); color: #ffffff; text-decoration: none; padding: 16px 35px; border-radius: 30px; font-weight: 600; font-size: 18px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(74, 144, 226, 0.35);">
                                                Explore Opportunities
                                            </a>
                                            <p style="margin: 20px 0 0 0; color: #666666; font-size: 15px;">
                                                Your next big opportunity awaits!
                                            </p>
                                        </div>
                                    </td>
                                </tr>



                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #1a1a1a; padding: 35px 30px; text-align: center;">
                                        <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 15px; font-weight: 600;">
                                            Telugu Info - Empowering Careers, Enriching Lives
                                        </p>
                                        <p style="margin: 0 0 20px 0; color: #9ea3a9; font-size: 13px; line-height: 1.6;">
                                            You're receiving this email because you subscribed to updates from Telugu Info.<br>
                                            Email sent to: ${email}
                                        </p>
                                        <div style="margin: 0;">
                                            <a href="#" style="color: #4A90E2; text-decoration: none; font-size: 13px; margin: 0 10px;">Unsubscribe</a>
                                            <span style="color: #666666;">|</span>
                                            <a href="#" style="color: #4A90E2; text-decoration: none; font-size: 13px; margin: 0 10px;">Privacy Policy</a>
                                            <span style="color: #666666;">|</span>
                                            <a href="#" style="color: #4A90E2; text-decoration: none; font-size: 13px; margin: 0 10px;">Contact Us</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
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