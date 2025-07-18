const express = require("express");
require("dotenv").config();
const connectdb = require("./src/config/db");
const mainRouter = require("./src/routers/router");
const emailRouter = require("./src/routers/emailRouter");
const http = require("http");
const cors = require('cors');
const authRoutes = require("./src/routes/authRoutes");

var PORT = process.env.PORT || 4000;
connectdb();
const app = express();
const server = require("http").createServer(app);

// Enable CORS for all routes
// Add proper CORS configuration
const whitelist = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://telugu-info.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);
app.use("/api/email", emailRouter);
app.use("/api/auth", authRoutes);
// azureOpenAi();
// openAiWithAzureKeys();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
