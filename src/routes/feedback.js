const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { sendEmail } = require('../utils/sendEmail');

// POST /api/feedback - Submit new feedback/testimonial
router.post('/', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();

        // Send thank you email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Thank You for Your Feedback!</h2>
                <p>Dear ${req.body.name},</p>
                <p>Thank you for taking the time to share your experience with Telugu Info. We greatly appreciate your feedback and are honored that you chose to provide a testimonial for our platform.</p>
                <p>Your testimonial has been added to our website and will help others understand the value of our services.</p>
                <p>Here's what you shared with us:</p>
                <ul>
                    <li>Rating: ${req.body.rating}/5</li>
                    <li>Testimonial: "${req.body.testimonial}"</li>
                </ul>
                <p>Best regards,<br>The Telugu Info Team</p>
            </div>
        `;

        await sendEmail(
            req.body.email,
            'Thank You for Your Testimonial - Telugu Info',
            emailHtml
        );

        res.status(201).json({ 
            message: 'Thank you for your feedback! Your testimonial has been added to our website.',
            success: true
        });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(400).json({ 
            message: 'Error submitting feedback',
            error: error.message,
            success: false
        });
    }
});

// GET /api/feedback/testimonials - Get all testimonials for public display
router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await Feedback.find()
            .select('name testimonial rating occupation location createdAt')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            testimonials
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ 
            message: 'Error fetching testimonials',
            error: error.message,
            success: false
        });
    }
});

module.exports = router;