const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
require('dotenv').config();

/**
 * Forgot Password - Generate reset token and send email
 */


const forgotPassword = async (req, res) => {
    
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User with this email does not exist' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // ✅ Use FRONTEND_URL to build clickable reset link
        const resetUrl = `https://telugu-info.vercel.app/reset-password/${resetToken}`;

        const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - Telugu Info</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">తెలుగు ఇన్ఫో</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Telugu Info</p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="white"/>
                                </svg>
                            </div>
                            <h2 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
                            <p style="color: #7f8c8d; margin: 0; font-size: 16px;">We received a request to reset your password</p>
                        </div>

                        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${user.name || 'Valued User'}</strong>,
                            </p>
                            <p style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your Telugu Info account. If you made this request, click the button below to create a new password.
                            </p>
                            <p style="margin: 0; color: #e74c3c; font-size: 14px; font-weight: 500;">
                                ⚠️ This link will expire in 1 hour for security reasons.
                            </p>
                        </div>

                        <!-- Action Button -->
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${resetUrl}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                                🔐 Reset My Password
                            </a>
                        </div>

                        <!-- Alternative Link -->
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                            <p style="margin: 0 0 10px 0; color: #7f8c8d; font-size: 14px; font-weight: 500;">If the button doesn't work, copy and paste this link:</p>
                            <p style="margin: 0; word-break: break-all; color: #667eea; font-size: 14px; font-family: 'Courier New', monospace; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #e9ecef;">
                                ${resetUrl}
                            </p>
                        </div>

                        <!-- Security Notice -->
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h4 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">🔒 Security Notice</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.6;">
                                <li>If you didn't request this password reset, please ignore this email</li>
                                <li>Your password will remain unchanged until you click the reset link</li>
                                <li>This link is unique to your account and cannot be used by anyone else</li>
                                <li>For additional security, consider enabling two-factor authentication</li>
                            </ul>
                        </div>

                        <!-- Help Section -->
                        <div style="text-align: center; margin: 40px 0 20px 0;">
                            <p style="color: #7f8c8d; font-size: 14px; margin: 0 0 10px 0;">Need help?</p>
                            <a href="mailto:support@telugu-info.com" style="color: #667eea; text-decoration: none; font-weight: 500;">Contact our support team</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 30px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0 0 15px 0; font-size: 14px;">
                            This is an automated email from Telugu Info. Please do not reply to this email.
                        </p>
                        <div style="border-top: 1px solid #34495e; padding-top: 20px;">
                            <p style="color: #95a5a6; margin: 0; font-size: 12px;">
                                © 2024 Telugu Info. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const emailResult = await sendEmail(user.email, 'Password Reset Request - Telugu Info', emailHtml);

        if (!emailResult.success) {
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Failed to send reset email. Please try again later.',
                error: emailResult.error
            });
        }

        console.log(`✅ Password reset email sent to: ${user.email}`);
        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully. Please check your inbox.',
            data: {
                email: user.email,
                tokenExpiry: resetTokenExpiry
            }
        });

    } catch (error) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

/**
 * Reset Password - Validate token and update password
 */
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token) return res.status(400).json({ success: false, message: 'Reset token is required' });
        if (!newPassword) return res.status(400).json({ success: false, message: 'New password is required' });
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        user.password = newPassword;
        user.clearResetToken();
        await user.save();

        // Send confirmation email
        const confirmationEmailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Changed - Telugu Info</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">తెలుగు ఇన్ఫో</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Telugu Info</p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
                                </svg>
                            </div>
                            <h2 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Password Changed Successfully</h2>
                            <p style="color: #7f8c8d; margin: 0; font-size: 16px;">Your account is now secure with your new password</p>
                        </div>

                        <div style="background-color: #d4edda; border-left: 4px solid #27ae60; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0 0 15px 0; color: #155724; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${user.name || 'Valued User'}</strong>,
                            </p>
                            <p style="margin: 0 0 15px 0; color: #155724; font-size: 16px; line-height: 1.6;">
                                This email confirms that your password for your Telugu Info account has been successfully changed. Your account is now secure with your new password.
                            </p>
                            <p style="margin: 0; color: #155724; font-size: 14px; font-weight: 500;">
                                ✅ Password change completed at ${new Date().toLocaleString()}
                            </p>
                        </div>

                        <!-- Action Button -->
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="https://telugu-info.vercel.app/login" 
                               style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4); transition: all 0.3s ease;">
                                🚀 Login to Your Account
                            </a>
                        </div>

                        <!-- Security Alert -->
                        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h4 style="margin: 0 0 10px 0; color: #721c24; font-size: 16px;">⚠️ Security Alert</h4>
                            <p style="margin: 0 0 10px 0; color: #721c24; font-size: 14px; line-height: 1.6;">
                                If you did not make this password change, please contact our support team immediately. Your account security may be compromised.
                            </p>
                            <a href="mailto:support@telugu-info.com" style="color: #721c24; text-decoration: none; font-weight: 500; font-size: 14px;">
                                🆘 Contact Support Immediately
                            </a>
                        </div>

                        <!-- Account Security Tips -->
                        <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h4 style="margin: 0 0 15px 0; color: #155724; font-size: 16px;">🔒 Account Security Tips</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #155724; font-size: 14px; line-height: 1.6;">
                                <li>Use a strong, unique password that you don't use elsewhere</li>
                                <li>Enable two-factor authentication for extra security</li>
                                <li>Never share your login credentials with anyone</li>
                                <li>Log out from shared devices after use</li>
                                <li>Regularly review your account activity</li>
                            </ul>
                        </div>

                        <!-- Help Section -->
                        <div style="text-align: center; margin: 40px 0 20px 0;">
                            <p style="color: #7f8c8d; font-size: 14px; margin: 0 0 10px 0;">Need assistance?</p>
                            <a href="mailto:support@telugu-info.com" style="color: #27ae60; text-decoration: none; font-weight: 500;">Contact our support team</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 30px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0 0 15px 0; font-size: 14px;">
                            This is an automated email from Telugu Info. Please do not reply to this email.
                        </p>
                        <div style="border-top: 1px solid #34495e; padding-top: 20px;">
                            <p style="color: #95a5a6; margin: 0; font-size: 12px;">
                                © 2024 Telugu Info. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const emailResult = await sendEmail(
            user.email,
            'Password Changed Successfully - Telugu Info',
            confirmationEmailHtml
        );

        if (!emailResult.success) {
            console.warn('❌ Failed to send password change confirmation email:', emailResult.error);
            // We don't want to fail the password reset if only the confirmation email fails
        } else {
            console.log(`✅ Password change confirmation email sent to: ${user.email}`);
        }

        console.log(`✅ Password reset successfully for user: ${user.email}`);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.',
            data: { email: user.email }
        });

    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    forgotPassword,
    resetPassword
};
