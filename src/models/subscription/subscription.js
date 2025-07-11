const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    name: {
        type: String,
        trim: true
    },
    preferences: {
        jobNotifications: {
            type: Boolean,
            default: true
        },
        examNotifications: {
            type: Boolean,
            default: true
        },
        educationalUpdates: {
            type: Boolean,
            default: true
        },
        careerTips: {
            type: Boolean,
            default: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    lastEmailSent: {
        type: Date,
        default: null
    },
    emailCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create indexes for better performance
subscriptionSchema.index({ email: 1 }, { unique: true });
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ 'preferences.jobNotifications': 1 });

// Method to increment email count
subscriptionSchema.methods.incrementEmailCount = function() {
    this.emailCount += 1;
    this.lastEmailSent = new Date();
    return this.save();
};

// Method to unsubscribe
subscriptionSchema.methods.unsubscribe = function() {
    this.isActive = false;
    return this.save();
};

// Method to resubscribe
subscriptionSchema.methods.resubscribe = function() {
    this.isActive = true;
    return this.save();
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription; 