const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
require('dotenv').config();

/**
 * Forgot Password - Generate reset token and send email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with this email does not exist'
            });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Set token expiry to 1 hour from now
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

        // Save reset token and expiry to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Create reset password URL
        const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

        // Email HTML template
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

        // Send reset email
        const emailResult = await sendEmail(
            user.email,
            'Password Reset Request - Telugu Info',
            emailHtml
        );

        if (!emailResult.success) {
            // Clear the reset token if email fails
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
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: error.message
        });
    }
};

/**
 * Reset Password - Validate token and update password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Validate inputs
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Reset token is required'
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password is required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password and clear reset token
        user.password = newPassword;
        user.clearResetToken();
        await user.save();

        console.log(`✅ Password reset successfully for user: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.',
            data: {
                email: user.email
            }
        });

    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: error.message
        });
    }
};

module.exports = {
    forgotPassword,
    resetPassword
}; 