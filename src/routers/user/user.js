const express = require('express');
const bcrypt = require('bcrypt');
const userDB = require('../../models/user/user');
const { sendEmail } = require('../../config/emailConfig');
const crypto = require('crypto');

const router = express.Router();

const saltRounds = 10;

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const user = await userDB.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Get all users (admin only)
router.get('/all', isAdmin, async (req, res) => {
    try {
        const users = await userDB.find({ isDeleted: false })
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 }); // Sort by newest first

        return res.status(200).json({
            success: true,
            data: users,
            total: users.length
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/register', async (req, res) => {
    const data = req.body;

    try {
        // Check if user already exists
        const user = await userDB.findOne({ email : data.email });
        if (user) {
            return res.status(400).json({ Success : false , message : 'User already exists please log in' });
        }

        // Validate required fields
        if (!data.name || !data.email || !data.password || !data.qualification) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, password, and qualification are required fields' 
            });
        }

        // Validate qualification
        const validQualifications = [
            "High School",
            "Intermediate",
            "Bachelor's Degree",
            "Master's Degree",
            "Ph.D.",
            "Diploma",
            "Other"
        ];
        if (!validQualifications.includes(data.qualification)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid qualification. Must be one of: ' + validQualifications.join(', ')
            });
        }

        // Validate gender if provided
        if (data.gender && !["male", "female"].includes(data.gender)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Gender must be either "male" or "female"' 
            });
        }

        // Validate mobile number format if provided
        if (data.mobile) {
            const mobileRegex = /^[0-9]{10}$/;  // Assumes 10-digit mobile number
            if (!mobileRegex.test(data.mobile)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Mobile number must be 10 digits' 
                });
            }
        }

        // Role validation
        if (data.role === 'admin') {
            // Check if request is from an admin
            const adminId = req.headers['user-id'];
            if (!adminId) {
                return res.status(403).json({ success: false, message: 'Admin access required to create admin users' });
            }

            const adminUser = await userDB.findById(adminId);
            if (!adminUser || adminUser.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Only admins can create other admin users' });
            }
        } else {
            // For non-admin registrations, ensure role is 'user'
            data.role = 'user';
        }

        // Hash password
        data.password = await bcrypt.hash(data.password, saltRounds);

        // Create new user
        const document = new userDB(data);

        // Save user to database
        await document.save();

        // Send welcome email
        const subject = 'Welcome to Telugu Info - Registration Successful';
        const text = `Dear ${data.name || 'User'},\n\nThank you for registering with Telugu Info Website. We are excited to have you join our community!\n\nYour account has been successfully created. You can now log in and start exploring our content.\n\nBest regards,\nThe Telugu Info Team`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2c3e50; text-align: center;">Welcome to Telugu Info</h1>
                <h2 style="color: #34495e; text-align: center;">Registration Successful</h2>
                <p style="font-size: 16px; line-height: 1.6;">Dear ${data.name || 'User'},</p>
                <p style="font-size: 16px; line-height: 1.6;">Thank you for registering with Telugu Info Website. We are excited to have you join our community!</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Your Account Details</h3>
                    <p style="font-size: 16px; line-height: 1.6;">Email: ${data.email}</p>
                    <p style="font-size: 16px; line-height: 1.6;">Qualification: ${data.qualification}</p>
                </div>
                <p style="font-size: 16px; line-height: 1.6;">Your account has been successfully created. You can now log in and start exploring our content.</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Join Our WhatsApp Channel</h3>
                    <p style="font-size: 16px; line-height: 1.6;">Get instant updates and stay connected with our community:</p>
                    <p style="font-size: 16px; line-height: 1.6;"><a href="https://whatsapp.com/channel/0029Va9UwjB6HXUNjS0Sf43L" style="color: #007bff; text-decoration: none;">Join WhatsApp Channel →</a></p>
                </div>
                <p style="font-size: 16px; line-height: 1.6;">Best regards,<br>The Telugu Info Team</p>
            </div>
        `;

        try {
            await sendEmail(data.email, subject, text, html);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the registration if email fails
        }

        return res.status(200).json({ success : true , data : document})

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success : false , message : err.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userDB.findOne({ email : email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not Found' });
        }

        console.log(user,"3");

        console.log(user.password, "1");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
});



module.exports = router;