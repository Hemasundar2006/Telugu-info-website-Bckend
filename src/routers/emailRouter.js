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
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <!-- Main Container -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                
                                <!-- Header Section -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                            🎯 Welcome to Telugu Info!
                                        </h1>
                                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px; opacity: 0.9;">
                                            Job & Exam Updates Subscription Confirmed
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Content Section -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 24px; font-weight: 600;">
                                            Hello! 👋
                                        </h2>
                                        
                                        <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            Thank you for joining the <strong>Telugu Info</strong> family! We're excited to have you as part of our growing community of job seekers and students.
                                        </p>
                                        
                                        <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            You'll now receive our carefully curated job and exam updates including:
                                        </p>
                                        
                                        <!-- Features List -->
                                        <div style="margin: 25px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #FF6B35;">
                                            <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 16px; line-height: 1.8;">
                                                <li><strong>💼 Job Notifications:</strong> Latest government and private sector openings</li>
                                                <li><strong>📝 Exam Details:</strong> Important exam dates, notifications, and results</li>
                                                <li><strong>🎓 Educational Updates:</strong> University admissions, courses, and scholarships</li>
                                                <li><strong>🏢 Career Opportunities:</strong> Internships, training programs, and career guidance</li>
                                                <li><strong>📊 Study Materials:</strong> Exam preparation resources and study tips</li>
                                            </ul>
                                        </div>
                                        
                                        <p style="margin: 25px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            Stay ahead in your career journey and never miss important job opportunities or exam notifications!
                                        </p>
                                        
                                        <!-- CTA Button -->
                                        <div style="text-align: center; margin: 30px 0;">
                                            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);">
                                                Browse Latest Jobs & Exams
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Social Media Section -->
                                <tr>
                                    <td style="padding: 0 30px 30px 30px;">
                                        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e9ecef;">
                                                                                    <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px;">
                                            Follow us for instant job & exam notifications:
                                        </p>
                                            <div style="margin: 0 auto; max-width: 200px;">
                                                <a href="#" style="display: inline-block; margin: 0 10px; color: #FF6B35; text-decoration: none; font-size: 20px;">
                                                    📘 Facebook
                                                </a>
                                                <a href="#" style="display: inline-block; margin: 0 10px; color: #FF6B35; text-decoration: none; font-size: 20px;">
                                                    📷 Instagram
                                                </a>
                                                <a href="#" style="display: inline-block; margin: 0 10px; color: #FF6B35; text-decoration: none; font-size: 20px;">
                                                    🐦 Twitter
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer Section -->
                                <tr>
                                    <td style="background-color: #2c3e50; padding: 30px; text-align: center;">
                                        <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px;">
                                            <strong>Telugu Info</strong> - Your Career & Education Partner
                                        </p>
                                        <p style="margin: 0 0 15px 0; color: #bdc3c7; font-size: 12px; line-height: 1.5;">
                                            This email was sent to ${email} because you subscribed to our newsletter.
                                        </p>
                                        <div style="margin: 20px 0 0 0;">
                                            <a href="#" style="color: #FF6B35; text-decoration: none; font-size: 12px; margin: 0 10px;">
                                                Unsubscribe
                                            </a>
                                            <span style="color: #bdc3c7; font-size: 12px;">|</span>
                                            <a href="#" style="color: #FF6B35; text-decoration: none; font-size: 12px; margin: 0 10px;">
                                                Privacy Policy
                                            </a>
                                            <span style="color: #bdc3c7; font-size: 12px;">|</span>
                                            <a href="#" style="color: #FF6B35; text-decoration: none; font-size: 12px; margin: 0 10px;">
                                                Contact Us
                                            </a>
                                        </div>
                                        <p style="margin: 15px 0 0 0; color: #95a5a6; font-size: 11px;">
                                            If you didn't subscribe to our newsletter, please ignore this email.
                                        </p>
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