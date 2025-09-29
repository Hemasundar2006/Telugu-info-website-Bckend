const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const ScholarshipDB = require('../../models/scholarship/scholarship');
const router = express.Router();

// Base URL for shareable links
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create new scholarship
router.post('/create-scholarship', async (req, res) => {
    try {
        const data = req.body;
        const scholarship = new ScholarshipDB(data);
        await scholarship.save();
        res.status(200).json({ success: true, data: scholarship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all scholarships with filters
router.get('/all-scholarships', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            scholarshipType,
            educationLevel,
            country,
            isActive,
            isFeatured
        } = req.query;

        const query = { isDeleted: false };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { organization: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (scholarshipType) query.scholarshipType = scholarshipType;
        if (educationLevel) query.educationLevel = { $in: [educationLevel] };
        if (country) query.country = { $regex: country, $options: 'i' };
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

        const scholarships = await ScholarshipDB.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ScholarshipDB.countDocuments(query);

        res.status(200).json({
            success: true,
            data: scholarships,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single scholarship by ID
router.get('/scholarship/:id', async (req, res) => {
    try {
        const scholarship = await ScholarshipDB.findById(req.params.id);
        if (!scholarship) {
            return res.status(404).json({ success: false, message: "Scholarship not found" });
        }
        res.status(200).json({ success: true, data: scholarship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update scholarship
router.put('/update-scholarship/:id', async (req, res) => {
    try {
        const scholarship = await ScholarshipDB.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!scholarship) {
            return res.status(404).json({ success: false, message: "Scholarship not found" });
        }
        res.status(200).json({ success: true, data: scholarship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete scholarship (soft delete)
router.delete('/delete-scholarship/:id', async (req, res) => {
    try {
        const scholarship = await ScholarshipDB.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!scholarship) {
            return res.status(404).json({ success: false, message: "Scholarship not found" });
        }
        res.status(200).json({ success: true, message: "Scholarship deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Generate shareable link
router.post('/generate-share-link/:id', async (req, res) => {
    try {
        const scholarship = await ScholarshipDB.findById(req.params.id);
        if (!scholarship) {
            return res.status(404).json({ success: false, message: "Scholarship not found" });
        }

        if (!scholarship.shareableLink) {
            const hash = crypto.randomBytes(8).toString('hex');
            scholarship.shareableLink = `${BASE_URL}/scholarship/${scholarship.id}/${hash}`;
            await scholarship.save();
        }

        res.status(200).json({
            success: true,
            data: {
                shareableLink: scholarship.shareableLink,
                socialLinks: {
                    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this scholarship opportunity: ${scholarship.title} by ${scholarship.organization}\n${scholarship.shareableLink}`)}`,
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(scholarship.shareableLink)}`,
                    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this scholarship opportunity: ${scholarship.title} by ${scholarship.organization}`)}&url=${encodeURIComponent(scholarship.shareableLink)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(scholarship.shareableLink)}`
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

        const scholarship = await ScholarshipDB.findById(req.params.id);
        if (!scholarship) {
            return res.status(404).json({ success: false, message: "Scholarship not found" });
        }

        scholarship.socialShares[platform]++;
        scholarship.shareCount++;
        await scholarship.save();

        res.status(200).json({
            success: true,
            data: {
                shareCount: scholarship.shareCount,
                socialShares: scholarship.socialShares
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get featured scholarships
router.get('/featured-scholarships', async (req, res) => {
    try {
        const scholarships = await ScholarshipDB.find({
            isDeleted: false,
            isActive: true,
            isFeatured: true
        }).sort({ createdAt: -1 }).limit(5);

        res.status(200).json({ success: true, data: scholarships });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
