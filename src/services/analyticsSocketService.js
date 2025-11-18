const { Server } = require('socket.io');
const { ActiveUsers } = require('../models/analytics/analytics');
const { cleanupActiveUsers } = require('../controllers/analyticsController');

class AnalyticsSocketService {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.setupSocketHandlers();
        this.startCleanupInterval();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Analytics client connected:', socket.id);

            // Handle user joining analytics dashboard
            socket.on('join-analytics', async (data) => {
                try {
                    socket.join('analytics-dashboard');
                    
                    // Send current active users count
                    const activeUsersCount = await ActiveUsers.countDocuments({
                        lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
                    });
                    
                    socket.emit('active-users-count', { count: activeUsersCount });
                    console.log('User joined analytics dashboard');
                } catch (error) {
                    console.error('Error joining analytics dashboard:', error);
                }
            });

            // Handle user activity tracking
            socket.on('user-activity', async (data) => {
                try {
                    const { sessionId, page, userId = null } = data;
                    
                    // Update active user record
                    await ActiveUsers.findOneAndUpdate(
                        { sessionId },
                        {
                            sessionId,
                            userId,
                            currentPage: page,
                            lastActivity: new Date(),
                            socketId: socket.id
                        },
                        { upsert: true }
                    );

                    // Broadcast to analytics dashboard
                    this.io.to('analytics-dashboard').emit('user-activity-update', {
                        sessionId,
                        page,
                        timestamp: new Date()
                    });
                } catch (error) {
                    console.error('Error tracking user activity:', error);
                }
            });

            // Handle page view events
            socket.on('page-view', (data) => {
                // Broadcast to analytics dashboard
                this.io.to('analytics-dashboard').emit('real-time-page-view', {
                    ...data,
                    timestamp: new Date()
                });
            });

            // Handle custom events
            socket.on('custom-event', (data) => {
                // Broadcast to analytics dashboard
                this.io.to('analytics-dashboard').emit('real-time-event', {
                    ...data,
                    timestamp: new Date()
                });
            });

            // Handle disconnect
            socket.on('disconnect', async () => {
                try {
                    // Remove user from active users if they were tracking
                    await ActiveUsers.deleteOne({ socketId: socket.id });
                    
                    // Update active users count
                    const activeUsersCount = await ActiveUsers.countDocuments({
                        lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
                    });
                    
                    this.io.to('analytics-dashboard').emit('active-users-count', { count: activeUsersCount });
                    console.log('Analytics client disconnected:', socket.id);
                } catch (error) {
                    console.error('Error handling disconnect:', error);
                }
            });
        });
    }

    // Broadcast real-time analytics updates
    broadcastAnalyticsUpdate(type, data) {
        this.io.to('analytics-dashboard').emit(type, {
            ...data,
            timestamp: new Date()
        });
    }

    // Broadcast page view update
    broadcastPageView(data) {
        this.broadcastAnalyticsUpdate('page-view-update', data);
    }

    // Broadcast event update
    broadcastEvent(data) {
        this.broadcastAnalyticsUpdate('event-update', data);
    }

    // Broadcast active users count
    async broadcastActiveUsersCount() {
        try {
            const activeUsersCount = await ActiveUsers.countDocuments({
                lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
            });
            
            this.io.to('analytics-dashboard').emit('active-users-count', { count: activeUsersCount });
        } catch (error) {
            console.error('Error broadcasting active users count:', error);
        }
    }

    // Start cleanup interval for inactive users
    startCleanupInterval() {
        // Clean up inactive users every 5 minutes
        setInterval(async () => {
            await cleanupActiveUsers();
            await this.broadcastActiveUsersCount();
        }, 5 * 60 * 1000);
    }

    // Get Socket.IO instance
    getIO() {
        return this.io;
    }
}

module.exports = AnalyticsSocketService; 