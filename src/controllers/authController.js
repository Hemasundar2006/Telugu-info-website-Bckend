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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You have requested to reset your password for Telugu Info website. Click the button below to reset your password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; text-align: center;">
                    This is an automated email from Telugu Info Support. Please do not reply to this email.
                </p>
            </div>
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Password Changed Successfully</h2>
                <p>Hello ${user.name || 'Valued User'},</p>
                <p>This email confirms that your password for Telugu Info website has been successfully changed.</p>
                <p>If you did not make this change, please contact our support team immediately.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://telugu-info.vercel.app/login" 
                       style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Login to Your Account
                    </a>
                </div>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; text-align: center;">
                    This is an automated email from Telugu Info Support. Please do not reply to this email.
                </p>
            </div>
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
