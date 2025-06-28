const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    careerTipsRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    jobRelevance: {
        type: String,
        required: true,
        enum: ['Very Relevant', 'Somewhat Relevant', 'Not Relevant']
    },
    topicsOfInterest: {
        type: String,
        required: true
    },
    additionalComments: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 