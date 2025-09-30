const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const feedbackRoutes = require('./routes/feedback');
const quizRouter = require('./routers/quiz/quizRouter');
const emailRouter = require('./routers/email/emailRouter');
const massEmailRouter = require('./routers/email/massEmailRouter');
const authRouter = require('./routes/authRoutes');

const sessionMiddleware = require('./src/middleware/session');
const { apiLimiter, authLimiter } = require('./src/middleware/rateLimit');
const errorHandler = require('./src/middleware/errorHandler');
const { scheduleDailyQuizGeneration } = require('./services/quizCronService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telugu-info', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  scheduleDailyQuizGeneration();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/quiz', quizRouter);
app.use('/api/emails', emailRouter);
app.use('/api/mass-emails', massEmailRouter);
app.use('/api/auth', authRouter);

// Notifications removed

app.use(sessionMiddleware);
app.use(errorHandler);

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

// Scheduled notification service removed

// Error handling fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
