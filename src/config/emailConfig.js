const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration missing. Please check your .env file for EMAIL_USER and EMAIL_PASS');
    process.exit(1);
}

// Create a transporter object with improved settings
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    // Add connection pool settings
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    // Add retry settings
    rateDelta: 1000, // milliseconds between retries
    rateLimit: 3, // max number of emails per second
    // Add timeout settings
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
});

// Verify transporter configuration with retry logic
const verifyTransporter = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            await transporter.verify();
            console.log('✅ Email server is ready to send messages');
            return true;
        } catch (error) {
            console.error(`❌ Email verification attempt ${i + 1} failed:`, error);
            if (i === retries - 1) {
                throw error;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Function to send email with retry logic
const sendEmail = async (to, subject, text, html, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                text,
                html,
                // Add message specific settings
                priority: 'high',
                headers: {
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High'
                }
            };

            const info = await transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error(`❌ Email sending attempt ${i + 1} failed:`, error);
            if (i === retries - 1) {
                return {
                    success: false,
                    error: error.message
                };
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Initialize the transporter
verifyTransporter().catch(error => {
    console.error('❌ Email configuration error:', error);
    // Don't exit process, allow application to continue without email capability
});

module.exports = {
    sendEmail,
    verifyTransporter,
    transporter
};