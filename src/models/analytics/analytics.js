const mongoose = require('mongoose');

// Page View Schema
const pageViewSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    page: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    referrer: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    device: {
        type: {
            type: String,
            enum: ['desktop', 'mobile', 'tablet'],
            default: 'desktop'
        },
        os: String,
        browser: String,
        model: String
    },
    screenResolution: {
        width: Number,
        height: Number
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    duration: {
        type: Number, // Time spent on page in seconds
        default: 0
    },
    isUnique: {
        type: Boolean,
        default: true
    }
});

// User Session Schema
const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: null
    },
    duration: {
        type: Number, // Total session duration in seconds
        default: 0
    },
    pageViews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userAgent: String,
    ipAddress: String,
    country: String,
    city: String,
    device: {
        type: String,
        os: String,
        browser: String,
        model: String
    },
    entryPage: String,
    exitPage: String,
    lastActivity: {
        type: Date,
        default: Date.now
    }
});

// Event Tracking Schema
const eventSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    eventType: {
        type: String,
        required: true,
        enum: ['click', 'scroll', 'form_submit', 'download', 'video_play', 'video_pause', 'search', 'signup', 'login', 'logout', 'purchase', 'custom']
    },
    eventName: {
        type: String,
        required: true
    },
    page: {
        type: String,
        required: true
    },
    element: {
        type: String, // CSS selector or element description
        default: null
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can store any type of data
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    coordinates: {
        x: Number,
        y: Number
    }
});

// Real-time Analytics Summary Schema
const analyticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    totalPageViews: {
        type: Number,
        default: 0
    },
    uniqueVisitors: {
        type: Number,
        default: 0
    },
    totalSessions: {
        type: Number,
        default: 0
    },
    averageSessionDuration: {
        type: Number,
        default: 0
    },
    bounceRate: {
        type: Number,
        default: 0
    },
    topPages: [{
        page: String,
        views: Number,
        uniqueViews: Number
    }],
    topReferrers: [{
        referrer: String,
        count: Number
    }],
    deviceBreakdown: {
        desktop: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 }
    },
    browserBreakdown: [{
        browser: String,
        count: Number
    }],
    countryBreakdown: [{
        country: String,
        count: Number
    }],
    hourlyData: [{
        hour: Number,
        pageViews: Number,
        uniqueVisitors: Number
    }],
    totalEvents: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Real-time Active Users Schema
const activeUsersSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    currentPage: String,
    lastActivity: {
        type: Date,
        default: Date.now
    },
    country: String,
    city: String,
    device: {
        type: String,
        browser: String,
        os: String
    },
    socketId: String
});

// Create indexes for better performance
pageViewSchema.index({ timestamp: -1, page: 1 });
pageViewSchema.index({ sessionId: 1, timestamp: 1 });
pageViewSchema.index({ userId: 1, timestamp: -1 });
sessionSchema.index({ startTime: -1 });
sessionSchema.index({ isActive: 1, lastActivity: -1 });
eventSchema.index({ timestamp: -1, eventType: 1 });
eventSchema.index({ sessionId: 1, timestamp: 1 });
analyticsSchema.index({ date: -1 });
activeUsersSchema.index({ lastActivity: -1 });
activeUsersSchema.index({ sessionId: 1 });

const PageView = mongoose.model('PageView', pageViewSchema);
const Session = mongoose.model('Session', sessionSchema);
const Event = mongoose.model('Event', eventSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);
const ActiveUsers = mongoose.model('ActiveUsers', activeUsersSchema);

module.exports = {
    PageView,
    Session,
    Event,
    Analytics,
    ActiveUsers
}; 