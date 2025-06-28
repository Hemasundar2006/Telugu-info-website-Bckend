const express = require('express');
const router = express.Router();
const Quiz = require('../../models/quiz/quiz');

// GET /api/quiz?topic=xyz&language=abc
router.get('/', async (req, res) => {
    try {
        const { topic, language } = req.query;

        // Validate required parameters
        if (!topic || !language) {
            return res.status(400).json({
                success: false,
                message: 'Topic and language parameters are required'
            });
        }

        // Validate topic
        if (!['aptitude', 'gk', 'reasoning'].includes(topic)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid topic. Must be one of: aptitude, gk, reasoning'
            });
        }

        // Validate language
        if (!['en', 'te'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language. Must be one of: en, te'
            });
        }

        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's quiz for the specified topic and language
        const quiz = await Quiz.findOne({
            topic,
            language,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).select('-questions.correctAnswer'); // Exclude correct answers from response

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'No quiz found for today with the specified topic and language'
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/quiz/validate
router.post('/validate', async (req, res) => {
    try {
        const { quizId, answers } = req.body;

        // Validate required parameters
        if (!quizId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Quiz ID and answers array are required'
            });
        }

        // Find the quiz
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Validate answers
        const results = quiz.questions.map((question, index) => ({
            question: question.question,
            userAnswer: answers[index],
            correctAnswer: question.correctAnswer,
            isCorrect: answers[index] === question.correctAnswer
        }));

        const score = results.filter(r => r.isCorrect).length;

        res.status(200).json({
            success: true,
            data: {
                score,
                totalQuestions: quiz.questions.length,
                percentage: (score / quiz.questions.length) * 100,
                results
            }
        });
    } catch (error) {
        console.error('Error validating quiz answers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router; 