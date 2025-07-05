const express = require('express');
const {
    trackPageView,
    trackEvent,
    endSession,
    getRealTimeAnalytics,
    getDashboardAnalytics,
    getSessionId
} = require('../../controllers/analyticsController');

const router = express.Router();

// Middleware to add Socket.IO instance to request
const addSocketIO = (req, res, next) => {
    if (req.app.get('socketService')) {
        req.io = req.app.get('socketService').getIO();
    }
    next();
};

// Apply middleware to all routes
router.use(addSocketIO);

// Generate new session ID
router.get('/session', getSessionId);

// Track page view
router.post('/track/pageview', trackPageView);

// Track custom event
router.post('/track/event', trackEvent);

// End session
router.post('/session/end', endSession);

// Get real-time analytics
router.get('/realtime', getRealTimeAnalytics);

// Get dashboard analytics
router.get('/dashboard', getDashboardAnalytics);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Analytics service is healthy',
        timestamp: new Date()
    });
});

module.exports = router; 