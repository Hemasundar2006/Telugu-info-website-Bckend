const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    notificationType: {
        type: String,
        enum: ['general', 'announcement', 'update', 'alert', 'reminder'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    targetAudience: {
        type: String,
        enum: ['all', 'registered', 'premium', 'admin'],
        default: 'all'
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    allowComments: {
        type: Boolean,
        default: false
    },
    actionText: {
        type: String,
        trim: true,
        maxlength: 50
    },
    actionLink: {
        type: String,
        trim: true
    },
    scheduledDate: {
        type: Date
    },
    scheduledTime: {
        type: String
    },
    isScheduled: {
        type: Boolean,
        default: false
    },
    isSent: {
        type: Boolean,
        default: false
    },
    sentAt: {
        type: Date
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
}, { 
    timestamps: true 
});

// Add indexes for better performance
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ readBy: 1 });
notificationSchema.index({ scheduledDate: 1, isScheduled: 1 });
notificationSchema.index({ targetAudience: 1 });
notificationSchema.index({ notificationType: 1 });
notificationSchema.index({ priority: 1 });

// Virtual for full scheduled datetime
notificationSchema.virtual('scheduledDateTime').get(function() {
    if (this.scheduledDate && this.scheduledTime) {
        const date = new Date(this.scheduledDate);
        const [hours, minutes] = this.scheduledTime.split(':');
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return date;
    }
    return null;
});

module.exports = mongoose.model('notification', notificationSchema);