const express = require('express');
const axios = require('axios');
const Course = require('../../models/course/course');
const crypto = require('crypto');
const { auth, isAdmin } = require('../../middleware/auth');

const router = express.Router();

async function fetchUrlPreview(targetUrl) {
    try {
        const response = await axios.get(targetUrl, { timeout: 8000 });
        const html = response.data;
        const getMeta = (nameAttr, value) => {
            const regex = new RegExp(`<meta[^>]+${nameAttr}=["']${value}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
            const match = html.match(regex);
            return match ? match[1] : undefined;
        };

        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const ogTitle = getMeta('property', 'og:title') || getMeta('name', 'og:title');
        const ogDesc = getMeta('property', 'og:description') || getMeta('name', 'og:description');
        const ogImage = getMeta('property', 'og:image') || getMeta('name', 'og:image');
        const siteName = getMeta('property', 'og:site_name') || getMeta('name', 'og:site_name');
        const metaDesc = getMeta('name', 'description');

        return {
            title: ogTitle || (titleMatch ? titleMatch[1] : undefined),
            description: ogDesc || metaDesc,
            image: ogImage,
            siteName
        };
    } catch (err) {
        return {};
    }
}

router.post('/courses', auth, isAdmin, async (req, res) => {
    try {
        const { autoPreview, title, url } = req.body;
        if (!title || !url) {
            return res.status(400).json({ success: false, message: 'title and url are required' });
        }

        let preview = {};
        if (autoPreview) {
            preview = await fetchUrlPreview(url);
        }

        const { autoPreview: _omit, ...rest } = req.body;
        const course = new Course({ ...rest, preview });
        await course.save();
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, isActive, isFeatured, category, tags, minPrice, maxPrice, minDuration, maxDuration } = req.query;
        const query = { isDeleted: { $ne: true } };
        if (typeof isActive !== 'undefined') query.isActive = isActive === 'true';
        if (typeof isFeatured !== 'undefined') query.isFeatured = isFeatured === 'true';
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) query.category = { $regex: category, $options: 'i' };
        if (tags) {
            const tagList = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
            if (tagList.length) query.tags = { $in: tagList };
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            query['pricing.amount'] = {};
            if (minPrice !== undefined) query['pricing.amount'].$gte = Number(minPrice);
            if (maxPrice !== undefined) query['pricing.amount'].$lte = Number(maxPrice);
        }
        if (minDuration !== undefined || maxDuration !== undefined) {
            query.videoDuration = {};
            if (minDuration !== undefined) query.videoDuration.$gte = Number(minDuration);
            if (maxDuration !== undefined) query.videoDuration.$lte = Number(maxDuration);
        }

        const courses = await Course.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            data: courses,
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

router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course || course.isDeleted) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/courses/:id', auth, isAdmin, async (req, res) => {
    try {
        const { autoPreview, url } = req.body;
        const updates = { ...req.body };
        delete updates.autoPreview;

        if (autoPreview && (url || typeof url === 'string')) {
            updates.preview = await fetchUrlPreview(url || '');
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/courses/:id', auth, isAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/courses/:id/refresh-preview', auth, isAdmin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (!course.isShareable) {
            return res.status(403).json({ success: false, message: 'Sharing disabled for this course' });
        }
        const preview = await fetchUrlPreview(course.url);
        course.preview = preview;
        await course.save();
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

// Shareable link generation
router.post('/courses/:id/generate-share-link', auth, isAdmin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (!course.isShareable) {
            return res.status(403).json({ success: false, message: 'Sharing disabled for this course' });
        }

        const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
        if (!course.shareableLink) {
            const hash = crypto.randomBytes(8).toString('hex');
            course.shareableLink = `${BASE_URL}/course/${course.id}/${hash}`;
            await course.save();
        }

        res.status(200).json({
            success: true,
            data: {
                shareableLink: course.shareableLink,
                socialLinks: {
                    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this course: ${course.title}\n${course.shareableLink}`)}`,
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(course.shareableLink)}`,
                    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this course: ${course.title}`)}&url=${encodeURIComponent(course.shareableLink)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(course.shareableLink)}`
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Track share
router.post('/courses/:id/track-share', async (req, res) => {
    try {
        const { platform } = req.body;
        const validPlatforms = ['whatsapp', 'linkedin', 'twitter', 'facebook'];
        if (!validPlatforms.includes(platform)) {
            return res.status(400).json({ success: false, message: 'Invalid sharing platform' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        course.socialShares[platform]++;
        course.shareCount++;
        await course.save();

        res.status(200).json({
            success: true,
            data: {
                shareCount: course.shareCount,
                socialShares: course.socialShares
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Featured courses
router.get('/courses-featured', async (req, res) => {
    try {
        const courses = await Course.find({ isDeleted: { $ne: true }, isActive: true, isFeatured: true })
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

