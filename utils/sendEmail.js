const nodemailer = require('nodemailer');

/**
 * Sends an email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise<Object>} Success status and any error message
 */
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = sendEmail; 