const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const PartTimeJobDB = require('../../models/partTimeJob/partTimeJob');
const router = express.Router();

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create
router.post('/create', async (req, res) => {
    try {
        const job = new PartTimeJobDB(req.body);
        await job.save();
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// List with filters
router.get('/all', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, location, workMode, isFeatured } = req.query;
        const query = { isDeleted: false, isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (location) query.location = { $regex: location, $options: 'i' };
        if (workMode) query.workMode = workMode;
        if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

        const items = await PartTimeJobDB.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await PartTimeJobDB.countDocuments(query);

        res.status(200).json({ success: true, data: items, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// One
router.get('/:id', async (req, res) => {
    try {
        const job = await PartTimeJobDB.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Part-time job not found' });
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update
router.put('/update/:id', async (req, res) => {
    try {
        const job = await PartTimeJobDB.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) return res.status(404).json({ success: false, message: 'Part-time job not found' });
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete (soft)
router.delete('/delete/:id', async (req, res) => {
    try {
        const job = await PartTimeJobDB.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!job) return res.status(404).json({ success: false, message: 'Part-time job not found' });
        res.status(200).json({ success: true, message: 'Part-time job deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Generate share link
router.post('/generate-share-link/:id', async (req, res) => {
    try {
        const job = await PartTimeJobDB.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Part-time job not found' });
        if (!job.shareableLink) {
            const hash = crypto.randomBytes(8).toString('hex');
            job.shareableLink = `${BASE_URL}/part-time/${job.id}/${hash}`;
            await job.save();
        }
        res.status(200).json({
            success: true,
            data: {
                shareableLink: job.shareableLink,
                socialLinks: {
                    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Part-time job: ${job.title} at ${job.companyName || ''}\n${job.shareableLink}`)}`,
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(job.shareableLink)}`,
                    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Part-time job: ${job.title} at ${job.companyName || ''}`)}&url=${encodeURIComponent(job.shareableLink)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(job.shareableLink)}`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Track share
router.post('/track-share/:id', async (req, res) => {
    try {
        const { platform } = req.body;
        const valid = ['whatsapp', 'linkedin', 'twitter', 'facebook'];
        if (!valid.includes(platform)) return res.status(400).json({ success: false, message: 'Invalid platform' });
        const job = await PartTimeJobDB.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Part-time job not found' });
        job.socialShares[platform]++;
        job.shareCount++;
        await job.save();
        res.status(200).json({ success: true, data: { shareCount: job.shareCount, socialShares: job.socialShares } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;


