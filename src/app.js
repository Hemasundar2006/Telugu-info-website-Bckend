const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const feedbackRoutes = require('./routes/feedback');
const quizRouter = require('./routers/quiz/quizRouter');
const emailRouter = require('./routers/email/emailRouter');
const authRouter = require('./routes/authRoutes');
const { scheduleDailyQuizGeneration } = require('./services/quizCronService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telugu-info', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    // Start the cron job after successful database connection
    scheduleDailyQuizGeneration();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// API routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/quiz', quizRouter);
app.use('/api/emails', emailRouter);
app.use('/api/auth', authRouter);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app; 