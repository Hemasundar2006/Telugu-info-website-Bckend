const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration missing. Please check your .env file for EMAIL_USER and EMAIL_PASS');
}

// Create a transporter object with production settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Only for development, remove in production
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        // Validate input parameters
        if (!to || !subject) {
            throw new Error('Missing required parameters: to and subject are required');
        }

        const mailOptions = {
            from: `"Telugu Info Website" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: text || '',
            html: html || text || '',
            headers: {
                'X-Entity-Ref-ID': Date.now().toString() // For tracking
            }
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { 
            success: true, 
            info,
            messageId: info.messageId 
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to send email',
            code: error.code
        };
    }
};

module.exports = {
    sendEmail
};
