const nodemailer = require('nodemailer');

// Add proper configuration validation and error handling
const createTransporter = async () => {
  try {
      if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
          throw new Error('Email configuration missing');
      }

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
          },
          pool: true, // Use pooled connections
          maxConnections: 5,
          maxMessages: 100
      });

      // Verify connection
      await transporter.verify();
      return transporter;
  } catch (error) {
      console.error('Email configuration error:', error);
      throw error;
  }
};

const sendApprovalEmail = async (toEmail, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: 'Account Approved',
      text: `Hello ${name}, your account has been approved by the admin.`,
    });
  } catch (err) {
    console.error('Failed to send approval email:', err);
    throw err;
  }
};

module.exports = { sendApprovalEmail }; 