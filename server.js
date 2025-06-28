const express = require('express');
const cors = require('cors');
const connectdb = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
connectdb();

// Routes
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Telugu Info Backend API is running!',
        version: '1.0.0',
        endpoints: {
            forgotPassword: 'POST /api/auth/forgot-password',
            resetPassword: 'POST /api/auth/reset-password/:token'
        }
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: {
            forgotPassword: 'POST /api/auth/forgot-password',
            resetPassword: 'POST /api/auth/reset-password/:token'
        }
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   POST /api/auth/forgot-password`);
    console.log(`   POST /api/auth/reset-password/:token`);
}); 