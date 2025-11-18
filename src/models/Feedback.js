const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    testimonial: {
        type: String,
        required: true,
        trim: true
    },
    occupation: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    isApproved: {
        type: Boolean,
        default: true  // Changed to true for auto-approval
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);