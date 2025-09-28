const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jobPostDB = require('../../models/jobPost/jobPost');
const Subscription = require('../../models/subscription/subscription');
const { sendEmail } = require('../../config/emailConfig');

// Base URL for shareable links - replace with your frontend URL in production
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const router = express.Router();

router.post('/create-jobPost', async (req, res) => {
    try {
        const data = req.body;
        const jobPost = new jobPostDB(data);
        await jobPost.save();
        res.status(200).json({ success : true, data : jobPost });
    } catch (error) {
        res.status(500).json({ success : false, message : error.message });
    }
});


router.get("/all-jobPost", async (req, res) => {
    try {
        const jobPosts = await jobPostDB.find();
        res.status(200).json({ success : true, data : jobPosts } )
    } catch (error) {
        res.status(500).json({ success : false, message : error.message });
    }
});


router.get('/get-jobPost/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const jobPost = await jobPostDB.findById(id);
        if (!jobPost) {
            return res.status(404).json({ success : false , message : "jobPost not Found" });
        }
        res.status(200).json({ success : true, data : jobPost });
    } catch (error) {
        res.status(500).json({ success : false, message : error.message});
    }
});

// Update a job post by ID
router.patch('/update-jobPost/:id', async (req, res) => {
    try {
        const { id } = req.params.id;
        const data = req.body;
        const jobPost = await jobPostDB.findByIdAndUpdate(id, { $set : data },  { new: true});
        if (!jobPost) {
            return res.status(404).json({ success : false, message : "Jobpost not found"});
        }
        res.status(200).json({ success : true, data : jobPost } );
    } catch (error) {
        res.status(500).json({ success : false, message : error.message });
    }
});



router.delete('/delete-jobPost/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const jobPost = await jobPostDB.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "jobPost not found" });
        }
        res.status(200).json({ success: true, data: jobPost });
    } catch (error) {
        res.status(500).json( { success : false, message :  error.message });
    }
});

// Share job post via email to all subscribers
router.post('/share-jobPost/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customMessage } = req.body;

        // Find the job post
        const jobPost = await jobPostDB.findById(id);
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Get all active subscribers who want job notifications
        const subscribers = await Subscription.find({
            isActive: true,
            'preferences.jobNotifications': true
        });

        if (subscribers.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No active subscribers found for job notifications",
                data: { sentCount: 0, totalSubscribers: 0 }
            });
        }

        // Create email content
        const subject = `🚨 New Job Opportunity: ${jobPost.jobTitle} at ${jobPost.companyName}`;
        
        // Generate HTML email template
        const html = generateJobPostEmailTemplate(jobPost, customMessage);
        
        // Generate plain text version
        const text = generateJobPostTextTemplate(jobPost, customMessage);

        let successCount = 0;
        let failureCount = 0;
        const failedEmails = [];

        // Send emails to all subscribers
        for (const subscriber of subscribers) {
            try {
                const result = await sendEmail(subscriber.email, subject, text, html);
                
                if (result.success) {
                    successCount++;
                    // Update subscriber stats
                    await subscriber.incrementEmailCount();
                } else {
                    failureCount++;
                    failedEmails.push({
                        email: subscriber.email,
                        error: result.error
                    });
                }
            } catch (error) {
                failureCount++;
                failedEmails.push({
                    email: subscriber.email,
                    error: error.message
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Job post shared successfully`,
            data: {
                jobPostId: id,
                jobTitle: jobPost.jobTitle,
                companyName: jobPost.companyName,
                sentCount: successCount,
                failureCount: failureCount,
                totalSubscribers: subscribers.length,
                failedEmails: failedEmails
            }
        });

    } catch (error) {
        console.error('Error sharing job post:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Generate HTML email template for job post
function generateJobPostEmailTemplate(jobPost, customMessage = '') {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getJobTypeEmoji = (jobType) => {
        const emojis = {
            'fullTime': '💼',
            'partTime': '⏰',
            'contract-based': '📋',
            'temporary': '📅'
        };
        return emojis[jobType] || '💼';
    };

    const getWorkModeEmoji = (workMode) => {
        const emojis = {
            'workFromHome': '🏠',
            'workFromOffice': '🏢',
            'Remote': '🌐'
        };
        return emojis[workMode] || '🏢';
    };

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Job Opportunity - ${jobPost.jobTitle}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <!-- Main Container -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            
                            <!-- Header Section -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                        🚨 New Job Opportunity!
                                    </h1>
                                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                        Don't miss this exciting opportunity
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Job Details Section -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 24px; font-weight: 600;">
                                        ${jobPost.jobTitle}
                                    </h2>
                                    
                                    <div style="margin: 25px 0; padding: 25px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #FF6B35;">
                                        <div style="margin-bottom: 15px;">
                                            <strong style="color: #2c3e50;">🏢 Company:</strong>
                                            <span style="color: #555; margin-left: 10px;">${jobPost.companyName || 'Not specified'}</span>
                                        </div>
                                        
                                        <div style="margin-bottom: 15px;">
                                            <strong style="color: #2c3e50;">📍 Location:</strong>
                                            <span style="color: #555; margin-left: 10px;">${jobPost.location}</span>
                                        </div>
                                        
                                        <div style="margin-bottom: 15px;">
                                            <strong style="color: #2c3e50;">${getJobTypeEmoji(jobPost.jobType)} Job Type:</strong>
                                            <span style="color: #555; margin-left: 10px;">${jobPost.jobType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                        </div>
                                        
                                        <div style="margin-bottom: 15px;">
                                            <strong style="color: #2c3e50;">${getWorkModeEmoji(jobPost.workMode)} Work Mode:</strong>
                                            <span style="color: #555; margin-left: 10px;">${jobPost.workMode.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                        </div>
                                        
                                        ${jobPost.requiredExperience ? `
                                        <div style="margin-bottom: 15px;">
                                            <strong style="color: #2c3e50;">📊 Experience:</strong>
                                            <span style="color: #555; margin-left: 10px;">${jobPost.requiredExperience} years</span>
                                        </div>
                                        ` : ''}
                                        
                                        ${jobPost.salary ? `
                                        <div style="margin-bottom: 15px;">
                                            <strong style="color: #2c3e50;">💰 Salary:</strong>
                                            <span style="color: #555; margin-left: 10px;">${jobPost.salary}</span>
                                        </div>
                                        ` : ''}
                                        
                                        <div style="margin-bottom: 15px;">
                                            <strong style="color: #2c3e50;">📅 Last Date to Apply:</strong>
                                            <span style="color: #FF6B35; margin-left: 10px; font-weight: 600;">${formatDate(jobPost.lastDate)}</span>
                                        </div>
                                    </div>
                                    
                                    ${jobPost.description ? `
                                    <div style="margin: 25px 0;">
                                        <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 18px;">📝 Job Description</h3>
                                        <p style="margin: 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            ${jobPost.description}
                                        </p>
                                    </div>
                                    ` : ''}
                                    
                                    ${jobPost.eligibility ? `
                                    <div style="margin: 25px 0;">
                                        <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 18px;">🎓 Eligibility</h3>
                                        <p style="margin: 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            ${jobPost.eligibility}
                                        </p>
                                    </div>
                                    ` : ''}
                                    
                                    ${customMessage ? `
                                    <div style="margin: 25px 0; padding: 20px; background-color: #e8f4fd; border-radius: 8px; border-left: 4px solid #2196F3;">
                                        <h3 style="margin: 0 0 10px 0; color: #1976D2; font-size: 16px;">💬 Special Message</h3>
                                        <p style="margin: 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            ${customMessage}
                                        </p>
                                    </div>
                                    ` : ''}
                                    
                                    <!-- CTA Buttons -->
                                    <div style="text-align: center; margin: 30px 0;">
                                        ${jobPost.linkToApply ? `
                                        <a href="${jobPost.linkToApply}" style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3); margin: 0 10px;">
                                            Apply Now
                                        </a>
                                        ` : ''}
                                        
                                        <a href="#" style="display: inline-block; background: #2c3e50; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 0 10px;">
                                            View All Jobs
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer Section -->
                            <tr>
                                <td style="background-color: #2c3e50; padding: 30px; text-align: center;">
                                    <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px;">
                                        <strong>Telugu Info</strong> - Your Career & Education Partner
                                    </p>
                                    <p style="margin: 0 0 15px 0; color: #bdc3c7; font-size: 12px; line-height: 1.5;">
                                        You received this email because you're subscribed to job notifications.
                                    </p>
                                    <div style="margin: 20px 0 0 0;">
                                        <a href="#" style="color: #FF6B35; text-decoration: none; font-size: 12px; margin: 0 10px;">
                                            Unsubscribe
                                        </a>
                                        <span style="color: #bdc3c7; font-size: 12px;">|</span>
                                        <a href="#" style="color: #FF6B35; text-decoration: none; font-size: 12px; margin: 0 10px;">
                                            Privacy Policy
                                        </a>
                                        <span style="color: #bdc3c7; font-size: 12px;">|</span>
                                        <a href="#" style="color: #FF6B35; text-decoration: none; font-size: 12px; margin: 0 10px;">
                                            Contact Us
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

// Generate plain text template for job post
function generateJobPostTextTemplate(jobPost, customMessage = '') {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return `
🚨 NEW JOB OPPORTUNITY - ${jobPost.jobTitle.toUpperCase()}

Company: ${jobPost.companyName || 'Not specified'}
Location: ${jobPost.location}
Job Type: ${jobPost.jobType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
Work Mode: ${jobPost.workMode.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
${jobPost.requiredExperience ? `Experience: ${jobPost.requiredExperience} years` : ''}
${jobPost.salary ? `Salary: ${jobPost.salary}` : ''}
Last Date to Apply: ${formatDate(jobPost.lastDate)}

${jobPost.description ? `Job Description: ${jobPost.description}` : ''}

${jobPost.eligibility ? `Eligibility: ${jobPost.eligibility}` : ''}

${customMessage ? `Special Message: ${customMessage}` : ''}

${jobPost.linkToApply ? `Apply Now: ${jobPost.linkToApply}` : ''}

---
Telugu Info - Your Career & Education Partner
You received this email because you're subscribed to job notifications.
    `;
}

// Generate shareable link for a job post
router.post('/generate-share-link/:id', async (req, res) => {
    try {
        const jobPost = await jobPostDB.findById(req.params.id);
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // If shareableLink doesn't exist, generate one
        if (!jobPost.shareableLink) {
            // Generate a unique hash for the job post
            const hash = crypto.randomBytes(8).toString('hex');
            jobPost.shareableLink = `${BASE_URL}/job/${jobPost.id}/${hash}`;
            await jobPost.save();
        }

        res.status(200).json({
            success: true,
            data: {
                shareableLink: jobPost.shareableLink,
                socialLinks: {
                    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this job opportunity: ${jobPost.jobTitle} at ${jobPost.companyName}\n${jobPost.shareableLink}`)}`,
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobPost.shareableLink)}`,
                    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job opportunity: ${jobPost.jobTitle} at ${jobPost.companyName}`)}&url=${encodeURIComponent(jobPost.shareableLink)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobPost.shareableLink)}`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Track social media shares
router.post('/track-share/:id', async (req, res) => {
    try {
        const { platform } = req.body;
        const validPlatforms = ['whatsapp', 'linkedin', 'twitter', 'facebook'];
        
        if (!validPlatforms.includes(platform)) {
            return res.status(400).json({ success: false, message: "Invalid sharing platform" });
        }

        const jobPost = await jobPostDB.findById(req.params.id);
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Increment the specific platform counter and total share count
        jobPost.socialShares[platform]++;
        jobPost.shareCount++;
        await jobPost.save();

        res.status(200).json({
            success: true,
            data: {
                shareCount: jobPost.shareCount,
                socialShares: jobPost.socialShares
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get share statistics for a job post
router.get('/share-stats/:id', async (req, res) => {
    try {
        const jobPost = await jobPostDB.findById(req.params.id);
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        res.status(200).json({
            success: true,
            data: {
                shareCount: jobPost.shareCount,
                socialShares: jobPost.socialShares
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;