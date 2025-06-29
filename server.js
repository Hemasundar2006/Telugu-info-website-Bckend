const express = require("express");
require("dotenv").config();
const connectdb = require("./src/config/db");
const authRoutes = require("./routes/authRoutes");
const massEmailRouter = require("./src/routers/email/massEmailRouter");
const userRouter = require("./src/routers/user/user");
const cors = require("cors");

const PORT = process.env.PORT || 4000;
connectdb();

const app = express();

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

// Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/emails", massEmailRouter);
app.use("/api/users", userRouter);

// Test route to verify server is working
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is working!' });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
