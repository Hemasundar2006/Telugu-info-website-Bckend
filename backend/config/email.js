const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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