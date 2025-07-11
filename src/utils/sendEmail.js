const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in your .env file');
}

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ Email configuration error:', error.message);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

/**
 * Send email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise<Object>} Result object with success status
 */
const sendEmail = async (to, subject, html) => {
    try {
        // Validate input parameters
        if (!to || !subject || !html) {
            throw new Error('Missing required parameters: to, subject, and html are required');
        }

        console.log(`📧 Sending email to: ${to}`);

        const mailOptions = {
            from: `"Telugu Info Support" <${process.env.EMAIL_USER1}>`,
            to: to,
            subject: subject,
            html: html,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully:', info.messageId);
        
        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };

    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
};

module.exports = { sendEmail }; 