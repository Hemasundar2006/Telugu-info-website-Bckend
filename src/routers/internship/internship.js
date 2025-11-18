const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const InternshipDB = require('../../models/internship/internship');
const router = express.Router();

// Base URL for shareable links
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create new internship
router.post('/create-internship', async (req, res) => {
    try {
        const data = req.body;
        const internship = new InternshipDB(data);
        await internship.save();
        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all internships with filters
router.get('/all-internships', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            location,
            internshipType,
            isActive,
            isFeatured
        } = req.query;

        const query = { isDeleted: false };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (location) query.location = { $regex: location, $options: 'i' };
        if (internshipType) query.internshipType = internshipType;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

        const internships = await InternshipDB.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await InternshipDB.countDocuments(query);

        res.status(200).json({
            success: true,
            data: internships,
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

// Get single internship by ID
router.get('/internship/:id', async (req, res) => {
    try {
        const internship = await InternshipDB.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ success: false, message: "Internship not found" });
        }
        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update internship
router.put('/update-internship/:id', async (req, res) => {
    try {
        const internship = await InternshipDB.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!internship) {
            return res.status(404).json({ success: false, message: "Internship not found" });
        }
        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete internship (soft delete)
router.delete('/delete-internship/:id', async (req, res) => {
    try {
        const internship = await InternshipDB.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!internship) {
            return res.status(404).json({ success: false, message: "Internship not found" });
        }
        res.status(200).json({ success: true, message: "Internship deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Generate shareable link
router.post('/generate-share-link/:id', async (req, res) => {
    try {
        const internship = await InternshipDB.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ success: false, message: "Internship not found" });
        }

        if (!internship.shareableLink) {
            const hash = crypto.randomBytes(8).toString('hex');
            internship.shareableLink = `${BASE_URL}/internship/${internship.id}/${hash}`;
            await internship.save();
        }

        res.status(200).json({
            success: true,
            data: {
                shareableLink: internship.shareableLink,
                socialLinks: {
                    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this internship opportunity: ${internship.title} at ${internship.companyName}\n${internship.shareableLink}`)}`,
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(internship.shareableLink)}`,
                    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this internship opportunity: ${internship.title} at ${internship.companyName}`)}&url=${encodeURIComponent(internship.shareableLink)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(internship.shareableLink)}`
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

        const internship = await InternshipDB.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ success: false, message: "Internship not found" });
        }

        internship.socialShares[platform]++;
        internship.shareCount++;
        await internship.save();

        res.status(200).json({
            success: true,
            data: {
                shareCount: internship.shareCount,
                socialShares: internship.socialShares
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get featured internships
router.get('/featured-internships', async (req, res) => {
    try {
        const internships = await InternshipDB.find({
            isDeleted: false,
            isActive: true,
            isFeatured: true
        }).sort({ createdAt: -1 }).limit(5);

        res.status(200).json({ success: true, data: internships });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
