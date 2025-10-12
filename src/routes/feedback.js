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

// GET /api/feedback/counts - Get count of testimonials, ratings, satisfaction and community statistics
router.get('/counts', async (req, res) => {
    try {
        // Get total count of testimonials
        const totalTestimonials = await Feedback.countDocuments();
        
        // Get count of approved testimonials
        const approvedTestimonials = await Feedback.countDocuments({ isApproved: true });
        
        // Get average rating
        const ratingStats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                    minRating: { $min: '$rating' },
                    maxRating: { $max: '$rating' }
                }
            }
        ]);

        // Get rating distribution (count of each rating 1-5)
        const ratingDistribution = await Feedback.aggregate([
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Format rating distribution
        const ratingBreakdown = {};
        ratingDistribution.forEach(item => {
            ratingBreakdown[`rating_${item._id}`] = item.count;
        });

        // Get recent testimonials count (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentTestimonials = await Feedback.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // SATISFACTION METRICS CALCULATIONS
        const stats = ratingStats[0] || {
            averageRating: 0,
            totalRatings: 0,
            minRating: 0,
            maxRating: 0
        };

        // Calculate Overall Satisfaction Score (0-100%)
        const overallSatisfactionScore = totalTestimonials > 0 ? 
            Math.round((stats.averageRating / 5) * 100) : 0;

        // Calculate Net Promoter Score (NPS)
        const promoters = ratingBreakdown.rating_5 || 0; // 5-star ratings
        const detractors = (ratingBreakdown.rating_1 || 0) + (ratingBreakdown.rating_2 || 0); // 1-2 star ratings
        const nps = totalTestimonials > 0 ? 
            Math.round(((promoters - detractors) / totalTestimonials) * 100) : 0;

        // Calculate Satisfaction Trends (last 7 days vs previous 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const recentWeekRatings = await Feedback.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        const previousWeekRatings = await Feedback.aggregate([
            { $match: { createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        const recentWeekAvg = recentWeekRatings[0]?.avgRating || 0;
        const previousWeekAvg = previousWeekRatings[0]?.avgRating || 0;
        const satisfactionTrend = previousWeekAvg > 0 ? 
            Math.round(((recentWeekAvg - previousWeekAvg) / previousWeekAvg) * 100) : 0;

        // Calculate Satisfaction by Rating Categories
        const satisfactionCategories = {
            excellent: ratingBreakdown.rating_5 || 0, // 5 stars
            good: ratingBreakdown.rating_4 || 0,      // 4 stars
            average: ratingBreakdown.rating_3 || 0,   // 3 stars
            poor: ratingBreakdown.rating_2 || 0,      // 2 stars
            terrible: ratingBreakdown.rating_1 || 0   // 1 star
        };

        // COMMUNITY METRICS CALCULATIONS
        // Import required models for community metrics
        const User = require('../models/user/user');
        const PageView = require('../models/analytics/analytics').PageView;
        const Session = require('../models/analytics/analytics').Session;

        // Community Engagement Score (based on testimonials, user activity, and ratings)
        const totalUsers = await User.countDocuments();
        const testimonialEngagementRate = totalUsers > 0 ? 
            Math.round((totalTestimonials / totalUsers) * 100) : 0;

        // Active Community Members (users who have given testimonials)
        const activeCommunityMembers = await Feedback.distinct('email').then(emails => emails.length);

        // Community Growth Rate (new testimonials in last 30 days vs previous 30 days)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const previousMonthTestimonials = await Feedback.countDocuments({
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        });
        const communityGrowthRate = previousMonthTestimonials > 0 ? 
            Math.round(((recentTestimonials - previousMonthTestimonials) / previousMonthTestimonials) * 100) : 
            (recentTestimonials > 0 ? 100 : 0);

        // User Interaction Metrics (if analytics data is available)
        let userInteractionMetrics = {
            totalPageViews: 0,
            uniqueVisitors: 0,
            averageSessionDuration: 0,
            bounceRate: 0
        };

        try {
            if (PageView && Session) {
                const last30Days = new Date();
                last30Days.setDate(last30Days.getDate() - 30);
                
                userInteractionMetrics.totalPageViews = await PageView.countDocuments({
                    timestamp: { $gte: last30Days }
                });
                
                userInteractionMetrics.uniqueVisitors = await Session.countDocuments({
                    startTime: { $gte: last30Days }
                });

                const avgSessionData = await Session.aggregate([
                    { $match: { startTime: { $gte: last30Days }, duration: { $gt: 0 } } },
                    { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
                ]);
                userInteractionMetrics.averageSessionDuration = avgSessionData[0]?.avgDuration || 0;

                const singlePageSessions = await Session.countDocuments({
                    startTime: { $gte: last30Days },
                    pageViews: 1
                });
                userInteractionMetrics.bounceRate = userInteractionMetrics.uniqueVisitors > 0 ? 
                    Math.round((singlePageSessions / userInteractionMetrics.uniqueVisitors) * 100) : 0;
            }
        } catch (analyticsError) {
            console.log('Analytics data not available, using default values');
        }

        // Content Engagement Levels
        const contentEngagement = {
            highEngagement: satisfactionCategories.excellent + satisfactionCategories.good,
            mediumEngagement: satisfactionCategories.average,
            lowEngagement: satisfactionCategories.poor + satisfactionCategories.terrible
        };

        res.json({
            success: true,
            counts: {
                totalTestimonials,
                approvedTestimonials,
                pendingTestimonials: totalTestimonials - approvedTestimonials,
                recentTestimonials,
                ratingStats: {
                    averageRating: Math.round(stats.averageRating * 100) / 100,
                    totalRatings: stats.totalRatings,
                    minRating: stats.minRating,
                    maxRating: stats.maxRating
                },
                ratingDistribution: ratingBreakdown,
                satisfactionMetrics: {
                    overallSatisfactionScore,
                    netPromoterScore: nps,
                    satisfactionTrend,
                    satisfactionCategories,
                    recentWeekAverage: Math.round(recentWeekAvg * 100) / 100,
                    previousWeekAverage: Math.round(previousWeekAvg * 100) / 100
                },
                communityMetrics: {
                    totalUsers,
                    activeCommunityMembers,
                    communityGrowthRate,
                    testimonialEngagementRate,
                    userInteractionMetrics,
                    contentEngagement
                }
            }
        });
    } catch (error) {
        console.error('Error fetching testimonial counts:', error);
        res.status(500).json({ 
            message: 'Error fetching testimonial counts',
            error: error.message,
            success: false
        });
    }
});

// GET /api/feedback/analytics - Get detailed satisfaction and community analytics
router.get('/analytics', async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        
        // Calculate date range based on period
        let startDate;
        const endDate = new Date();
        
        switch (period) {
            case '7d':
                startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Import required models
        const User = require('../models/user/user');
        const PageView = require('../models/analytics/analytics').PageView;
        const Session = require('../models/analytics/analytics').Session;

        // SATISFACTION ANALYTICS
        const satisfactionAnalytics = await Feedback.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: null,
                    totalTestimonials: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    minRating: { $min: '$rating' },
                    maxRating: { $max: '$rating' },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            }
        ]);

        // Calculate satisfaction trends over time (daily)
        const satisfactionTrends = await Feedback.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    dailyAverage: { $avg: '$rating' },
                    dailyCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);

        // COMMUNITY ANALYTICS
        const communityAnalytics = await User.aggregate([
            {
                $lookup: {
                    from: 'feedbacks',
                    localField: 'email',
                    foreignField: 'email',
                    as: 'testimonials'
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    usersWithTestimonials: {
                        $sum: { $cond: [{ $gt: [{ $size: '$testimonials' }, 0] }, 1, 0] }
                    },
                    totalTestimonials: { $sum: { $size: '$testimonials' } }
                }
            }
        ]);

        // User engagement by location
        const engagementByLocation = await Feedback.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate }, location: { $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: '$location',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // User engagement by occupation
        const engagementByOccupation = await Feedback.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate }, occupation: { $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: '$occupation',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Advanced satisfaction metrics
        const satisfactionData = satisfactionAnalytics[0] || {
            totalTestimonials: 0,
            averageRating: 0,
            minRating: 0,
            maxRating: 0,
            ratingDistribution: []
        };

        const ratingDist = satisfactionData.ratingDistribution || [];
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingDist.forEach(rating => {
            ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        });

        // Calculate advanced satisfaction metrics
        const promoters = ratingCounts[5] || 0;
        const passives = ratingCounts[4] || 0;
        const detractors = (ratingCounts[1] || 0) + (ratingCounts[2] || 0);
        const total = satisfactionData.totalTestimonials;

        const nps = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
        const csat = total > 0 ? Math.round((satisfactionData.averageRating / 5) * 100) : 0;
        const satisfactionScore = total > 0 ? Math.round(((promoters + passives) / total) * 100) : 0;

        // Community health metrics
        const communityData = communityAnalytics[0] || {
            totalUsers: 0,
            usersWithTestimonials: 0,
            totalTestimonials: 0
        };

        const communityHealthScore = communityData.totalUsers > 0 ? 
            Math.round((communityData.usersWithTestimonials / communityData.totalUsers) * 100) : 0;

        const testimonialPerUser = communityData.usersWithTestimonials > 0 ? 
            Math.round((communityData.totalTestimonials / communityData.usersWithTestimonials) * 100) / 100 : 0;

        res.json({
            success: true,
            period,
            dateRange: {
                startDate,
                endDate
            },
            satisfactionAnalytics: {
                overallMetrics: {
                    totalTestimonials: satisfactionData.totalTestimonials,
                    averageRating: Math.round(satisfactionData.averageRating * 100) / 100,
                    minRating: satisfactionData.minRating,
                    maxRating: satisfactionData.maxRating,
                    overallSatisfactionScore: csat,
                    netPromoterScore: nps,
                    customerSatisfactionScore: satisfactionScore
                },
                ratingBreakdown: {
                    excellent: ratingCounts[5] || 0,
                    good: ratingCounts[4] || 0,
                    average: ratingCounts[3] || 0,
                    poor: ratingCounts[2] || 0,
                    terrible: ratingCounts[1] || 0
                },
                trends: satisfactionTrends.map(trend => ({
                    date: new Date(trend._id.year, trend._id.month - 1, trend._id.day),
                    averageRating: Math.round(trend.dailyAverage * 100) / 100,
                    testimonialCount: trend.dailyCount
                }))
            },
            communityAnalytics: {
                overallMetrics: {
                    totalUsers: communityData.totalUsers,
                    activeCommunityMembers: communityData.usersWithTestimonials,
                    communityHealthScore,
                    testimonialPerUser,
                    engagementRate: communityData.totalUsers > 0 ? 
                        Math.round((communityData.usersWithTestimonials / communityData.totalUsers) * 100) : 0
                },
                engagementByLocation,
                engagementByOccupation
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ 
            message: 'Error fetching analytics',
            error: error.message,
            success: false
        });
    }
});

module.exports = router;