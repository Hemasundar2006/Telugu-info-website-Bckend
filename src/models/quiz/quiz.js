const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        required: true,
        trim: true
    }],
    correctAnswer: {
        type: String,
        required: true,
        trim: true
    }
});

const quizSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        enum: ['aptitude', 'gk', 'reasoning'],
        trim: true
    },
    language: {
        type: String,
        required: true,
        enum: ['en', 'te'],
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    questions: [questionSchema]
}, {
    timestamps: true
});

// Create compound index for efficient querying
quizSchema.index({ topic: 1, language: 1, date: -1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 