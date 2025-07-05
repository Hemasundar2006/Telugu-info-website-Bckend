const express = require("express");
const http = require("http");
const { Server } = require('socket.io');
require("dotenv").config();
const connectdb = require("./src/config/db");
const authRoutes = require("./routes/authRoutes");
const massEmailRouter = require("./src/routers/email/massEmailRouter");
const userRouter = require("./src/routers/user/user");
const analyticsRouter = require("./src/routers/analytics/analyticsRouter");
const { ActiveUsers } = require("./src/models/analytics/analytics");
const { cleanupActiveUsers } = require("./src/controllers/analyticsController");
const cors = require("cors");

const PORT = process.env.PORT || 4000;
connectdb();

const app = express();
const server = http.createServer(app);

// CORS setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'user-id'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
}));

app.options('*', cors());

// Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: '*', // In production, replace with your actual frontend domain
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.set('io', io);

// Socket.IO Analytics Connection Handler
io.on('connection', (socket) => {
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
            io.to('analytics-dashboard').emit('user-activity-update', {
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
        io.to('analytics-dashboard').emit('real-time-page-view', {
            ...data,
            timestamp: new Date()
        });
    });

    // Handle custom events
    socket.on('custom-event', (data) => {
        // Broadcast to analytics dashboard
        io.to('analytics-dashboard').emit('real-time-event', {
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
            
            io.to('analytics-dashboard').emit('active-users-count', { count: activeUsersCount });
            console.log('Analytics client disconnected:', socket.id);
        } catch (error) {
            console.error('Error handling disconnect:', error);
        }
    });
});

// Clean up inactive users every 5 minutes
setInterval(async () => {
    await cleanupActiveUsers();
    const activeUsersCount = await ActiveUsers.countDocuments({
        lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
    });
    io.to('analytics-dashboard').emit('active-users-count', { count: activeUsersCount });
}, 5 * 60 * 1000);

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/emails", massEmailRouter);
app.use("/api/users", userRouter);
app.use("/api/analytics", analyticsRouter);

// Test routes
app.get('/', (req, res) => {
    res.send('Server is running with Analytics!');
});

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is working!' });
});

// Test Socket.IO endpoint
app.get('/api/socket-test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Socket.IO is initialized',
        socketConnected: io.engine.clientsCount 
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🔥 Analytics and WebSocket service initialized`);
});
