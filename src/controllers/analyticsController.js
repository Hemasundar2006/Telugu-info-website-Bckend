const { PageView, Session, Event, Analytics, ActiveUsers } = require('../models/analytics/analytics');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

// Helper function to parse user agent and get device info
const getDeviceInfo = (userAgent) => {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    let deviceType = 'desktop';
    if (result.device.type === 'mobile') deviceType = 'mobile';
    else if (result.device.type === 'tablet') deviceType = 'tablet';
    
    return {
        type: deviceType,
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown',
        model: result.device.model || null
    };
};

// Helper function to get client IP and location
const getLocationInfo = (req) => {
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               req.ip;
    
    const geo = geoip.lookup(ip);
    return {
        ip: ip,
        country: geo ? geo.country : null,
        city: geo ? geo.city : null
    };
};

// Generate unique session ID
const generateSessionId = () => {
    return uuidv4();
};

// Track page view
const trackPageView = async (req, res) => {
    try {
        const {
            sessionId,
            page,
            title,
            referrer,
            screenResolution,
            userId = null
        } = req.body;

        const userAgent = req.headers['user-agent'] || '';
        const locationInfo = getLocationInfo(req);
        const device = getDeviceInfo(userAgent);

        // Create or update session
        let session = await Session.findOne({ sessionId });
        if (!session) {
            session = new Session({
                sessionId,
                userId,
                userAgent,
                ipAddress: locationInfo.ip,
                country: locationInfo.country,
                city: locationInfo.city,
                device,
                pageViews: 1,
                entryPage: page,
                lastActivity: new Date()
            });
        } else {
            session.pageViews += 1;
            session.isActive = true;
            session.lastActivity = new Date();
            session.exitPage = page;
        }
        await session.save();

        // Check if this is a unique page view for this session
        const existingPageView = await PageView.findOne({ sessionId, page });
        const isUnique = !existingPageView;

        // Create page view record
        const pageView = new PageView({
            sessionId,
            userId,
            page,
            title,
            referrer,
            userAgent,
            ipAddress: locationInfo.ip,
            country: locationInfo.country,
            city: locationInfo.city,
            device,
            screenResolution,
            isUnique
        });

        await pageView.save();

        // Update or create active user record
        await ActiveUsers.findOneAndUpdate(
            { sessionId },
            {
                sessionId,
                userId,
                currentPage: page,
                lastActivity: new Date(),
                country: locationInfo.country,
                city: locationInfo.city,
                device
            },
            { upsert: true }
        );

        // Emit real-time update via WebSocket (if available)
        if (req.io) {
            req.io.emit('pageViewUpdate', {
                page,
                title,
                country: locationInfo.country,
                device: device.type,
                timestamp: new Date()
            });
        }

        res.status(200).json({
            success: true,
            message: 'Page view tracked successfully',
            sessionId: sessionId
        });
    } catch (error) {
        console.error('Error tracking page view:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking page view',
            error: error.message
        });
    }
};

// Track custom event
const trackEvent = async (req, res) => {
    try {
        const {
            sessionId,
            eventType,
            eventName,
            page,
            element,
            value,
            coordinates,
            userId = null
        } = req.body;

        const event = new Event({
            sessionId,
            userId,
            eventType,
            eventName,
            page,
            element,
            value,
            coordinates
        });

        await event.save();

        // Emit real-time event update
        if (req.io) {
            req.io.emit('eventUpdate', {
                eventType,
                eventName,
                page,
                timestamp: new Date()
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking event:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking event',
            error: error.message
        });
    }
};

// Update session duration and end session
const endSession = async (req, res) => {
    try {
        const { sessionId, duration } = req.body;

        const session = await Session.findOne({ sessionId });
        if (session) {
            session.duration = duration;
            session.endTime = new Date();
            session.isActive = false;
            await session.save();
        }

        // Remove from active users
        await ActiveUsers.deleteOne({ sessionId });

        res.status(200).json({
            success: true,
            message: 'Session ended successfully'
        });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({
            success: false,
            message: 'Error ending session',
            error: error.message
        });
    }
};

// Get real-time analytics
const getRealTimeAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const last30Minutes = new Date(now.getTime() - 30 * 60 * 1000);
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Active users (last 30 minutes)
        const activeUsers = await ActiveUsers.find({
            lastActivity: { $gte: last30Minutes }
        }).sort({ lastActivity: -1 });

        // Page views in last 24 hours
        const pageViewsLast24h = await PageView.countDocuments({
            timestamp: { $gte: last24Hours }
        });

        // Unique visitors in last 24 hours
        const uniqueVisitorsLast24h = await Session.countDocuments({
            startTime: { $gte: last24Hours }
        });

        // Top pages in last 24 hours
        const topPages = await PageView.aggregate([
            { $match: { timestamp: { $gte: last24Hours } } },
            { $group: { _id: '$page', views: { $sum: 1 }, uniqueViews: { $addToSet: '$sessionId' } } },
            { $project: { page: '$_id', views: 1, uniqueViews: { $size: '$uniqueViews' }, _id: 0 } },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]);

        // Recent page views (last 20)
        const recentPageViews = await PageView.find({
            timestamp: { $gte: last24Hours }
        })
        .sort({ timestamp: -1 })
        .limit(20)
        .select('page title timestamp device.type country sessionId');

        // Device breakdown for active users
        const deviceBreakdown = await ActiveUsers.aggregate([
            { $match: { lastActivity: { $gte: last30Minutes } } },
            { $group: { _id: '$device.type', count: { $sum: 1 } } },
            { $project: { device: '$_id', count: 1, _id: 0 } }
        ]);

        // Country breakdown for active users
        const countryBreakdown = await ActiveUsers.aggregate([
            { $match: { lastActivity: { $gte: last30Minutes }, country: { $ne: null } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $project: { country: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Hourly data for last 24 hours
        const hourlyData = await PageView.aggregate([
            { $match: { timestamp: { $gte: last24Hours } } },
            {
                $group: {
                    _id: { hour: { $hour: '$timestamp' } },
                    pageViews: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$sessionId' }
                }
            },
            {
                $project: {
                    hour: '$_id.hour',
                    pageViews: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' },
                    _id: 0
                }
            },
            { $sort: { hour: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                activeUsers: {
                    count: activeUsers.length,
                    users: activeUsers
                },
                pageViewsLast24h,
                uniqueVisitorsLast24h,
                topPages,
                recentPageViews,
                deviceBreakdown,
                countryBreakdown,
                hourlyData,
                lastUpdated: now
            }
        });
    } catch (error) {
        console.error('Error getting real-time analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting real-time analytics',
            error: error.message
        });
    }
};

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
    try {
        const { period = '7d', page = null } = req.query;
        
        let startDate;
        const endDate = new Date();
        
        switch (period) {
            case '1d':
                startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
                break;
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
                startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const matchQuery = { timestamp: { $gte: startDate, $lte: endDate } };
        if (page) matchQuery.page = page;

        // Total page views
        const totalPageViews = await PageView.countDocuments(matchQuery);

        // Unique visitors
        const uniqueVisitors = await Session.countDocuments({
            startTime: { $gte: startDate, $lte: endDate }
        });

        // Average session duration
        const avgSessionDuration = await Session.aggregate([
            { $match: { startTime: { $gte: startDate, $lte: endDate }, duration: { $gt: 0 } } },
            { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
        ]);

        // Bounce rate (sessions with only 1 page view)
        const singlePageSessions = await Session.countDocuments({
            startTime: { $gte: startDate, $lte: endDate },
            pageViews: 1
        });
        const bounceRate = uniqueVisitors > 0 ? (singlePageSessions / uniqueVisitors) * 100 : 0;

        // Page views over time
        const pageViewsOverTime = await PageView.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' },
                        day: { $dayOfMonth: '$timestamp' }
                    },
                    views: { $sum: 1 },
                    uniqueViews: { $addToSet: '$sessionId' }
                }
            },
            {
                $project: {
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day'
                        }
                    },
                    views: 1,
                    uniqueViews: { $size: '$uniqueViews' },
                    _id: 0
                }
            },
            { $sort: { date: 1 } }
        ]);

        // Top pages
        const topPages = await PageView.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$page', views: { $sum: 1 }, uniqueViews: { $addToSet: '$sessionId' } } },
            { $project: { page: '$_id', views: 1, uniqueViews: { $size: '$uniqueViews' }, _id: 0 } },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]);

        // Top referrers
        const topReferrers = await PageView.aggregate([
            { $match: { ...matchQuery, referrer: { $ne: null, $ne: '' } } },
            { $group: { _id: '$referrer', count: { $sum: 1 } } },
            { $project: { referrer: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Device breakdown
        const deviceBreakdown = await PageView.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$device.type', count: { $sum: 1 } } },
            { $project: { device: '$_id', count: 1, _id: 0 } }
        ]);

        // Browser breakdown
        const browserBreakdown = await PageView.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$device.browser', count: { $sum: 1 } } },
            { $project: { browser: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Country breakdown
        const countryBreakdown = await PageView.aggregate([
            { $match: { ...matchQuery, country: { $ne: null } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $project: { country: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Event tracking
        const topEvents = await Event.aggregate([
            { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { type: '$eventType', name: '$eventName' }, count: { $sum: 1 } } },
            { $project: { eventType: '$_id.type', eventName: '$_id.name', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalPageViews,
                    uniqueVisitors,
                    averageSessionDuration: Math.round((avgSessionDuration[0]?.avgDuration || 0) * 100) / 100,
                    bounceRate: Math.round(bounceRate * 100) / 100
                },
                pageViewsOverTime,
                topPages,
                topReferrers,
                deviceBreakdown,
                browserBreakdown,
                countryBreakdown,
                topEvents,
                period,
                startDate,
                endDate
            }
        });
    } catch (error) {
        console.error('Error getting dashboard analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting dashboard analytics',
            error: error.message
        });
    }
};

// Get session ID for new visitors
const getSessionId = async (req, res) => {
    try {
        const sessionId = generateSessionId();
        res.status(200).json({
            success: true,
            sessionId
        });
    } catch (error) {
        console.error('Error generating session ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating session ID',
            error: error.message
        });
    }
};

// Clean up old active user records (called periodically)
const cleanupActiveUsers = async () => {
    try {
        const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
        await ActiveUsers.deleteMany({ lastActivity: { $lt: cutoffTime } });
        console.log('Cleaned up inactive users');
    } catch (error) {
        console.error('Error cleaning up active users:', error);
    }
};

module.exports = {
    trackPageView,
    trackEvent,
    endSession,
    getRealTimeAnalytics,
    getDashboardAnalytics,
    getSessionId,
    cleanupActiveUsers
}; 