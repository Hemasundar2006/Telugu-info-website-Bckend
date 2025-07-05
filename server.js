const express = require("express");
const http = require("http");
require("dotenv").config();
const connectdb = require("./src/config/db");
const authRoutes = require("./routes/authRoutes");
const massEmailRouter = require("./src/routers/email/massEmailRouter");
const userRouter = require("./src/routers/user/user");
const analyticsRouter = require("./src/routers/analytics/analyticsRouter");
const AnalyticsSocketService = require("./src/services/analyticsSocketService");
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO service for analytics
const socketService = new AnalyticsSocketService(server);
app.set('socketService', socketService);

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/emails", massEmailRouter);
app.use("/api/users", userRouter);
app.use("/api/analytics", analyticsRouter);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is working!' });
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
