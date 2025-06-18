const express = require('express');
const app = express();
const feedbackRoutes = require('./routes/feedback');

// Serve static files from the public directory
app.use(express.static('public'));

// API routes
app.use('/api/feedback', feedbackRoutes);

// ... rest of the code ... 