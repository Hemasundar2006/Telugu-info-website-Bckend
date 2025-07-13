const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isGlobal: {
        type: Boolean,
        default: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

// Add indexes for better performance
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ readBy: 1 });

module.exports = mongoose.model('notification', notificationSchema);