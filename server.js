const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Set io instance in app for use in routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});