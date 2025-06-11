const express = require("express");
require("dotenv").config();
const connectdb = require("./src/config/db");
const mainRouter = require("./src/routers/router");
const emailRouter = require("./src/routers/emailRouter");
const http = require("http");
const cors = require('cors');

var PORT = process.env.PORT || 4000;
connectdb();
const app = express();
const server = require("http").createServer(app);

// Enable CORS for all routes
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
app.use("/api", mainRouter);
app.use("/api/email", emailRouter);

// azureOpenAi();
// openAiWithAzureKeys();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
