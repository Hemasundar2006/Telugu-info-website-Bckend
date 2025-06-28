const cron = require('node-cron');
const axios = require('axios');
const Quiz = require('../models/quiz/quiz');

// Categories mapping for Open Trivia DB
const CATEGORY_MAPPING = {
    aptitude: 19, // Math
    gk: 9,        // General Knowledge
    reasoning: 18  // Computer Science (closest to reasoning)
};

// Function to translate text using a translation API (you'll need to implement this)
async function translateToTelugu(text) {
    // TODO: Implement translation logic using a translation API
    // For now, we'll append "(in Telugu)" to indicate it needs translation
    return `${text} (in Telugu)`;
}

// Function to fetch questions from Open Trivia DB
async function fetchQuestions(category) {
    try {
        const response = await axios.get('https://opentdb.com/api.php', {
            params: {
                amount: 10,
                category: CATEGORY_MAPPING[category],
                type: 'multiple',
                difficulty: 'medium'
            }
        });

        if (response.data.response_code !== 0) {
            throw new Error('Failed to fetch questions from Open Trivia DB');
        }

        return response.data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: q.correct_answer
        }));
    } catch (error) {
        console.error(`Error fetching questions for ${category}:`, error);
        throw error;
    }
}

// Function to create quiz for a specific topic and language
async function createQuizForTopicAndLanguage(topic, language, questions) {
    try {
        // If language is Telugu, translate questions and options
        if (language === 'te') {
            questions = await Promise.all(questions.map(async q => ({
                question: await translateToTelugu(q.question),
                options: await Promise.all(q.options.map(opt => translateToTelugu(opt))),
                correctAnswer: await translateToTelugu(q.correctAnswer)
            })));
        }

        // Create new quiz
        const quiz = new Quiz({
            topic,
            language,
            questions
        });

        await quiz.save();
        console.log(`Created quiz for ${topic} in ${language}`);
    } catch (error) {
        console.error(`Error creating quiz for ${topic} in ${language}:`, error);
        throw error;
    }
}

// Main function to generate quizzes
async function generateDailyQuizzes() {
    try {
        console.log('Starting daily quiz generation...');

        const topics = ['aptitude', 'gk', 'reasoning'];
        const languages = ['en', 'te'];

        for (const topic of topics) {
            // Fetch questions once per topic
            const questions = await fetchQuestions(topic);

            // Create quiz for each language
            for (const language of languages) {
                await createQuizForTopicAndLanguage(topic, language, questions);
            }
        }

        console.log('Daily quiz generation completed successfully');
    } catch (error) {
        console.error('Error in daily quiz generation:', error);
    }
}

// Schedule cron job to run at midnight every day
const scheduleDailyQuizGeneration = () => {
    cron.schedule('0 0 * * *', generateDailyQuizzes, {
        timezone: 'Asia/Kolkata' // Adjust timezone as needed
    });
    console.log('Daily quiz generation scheduled');
};

module.exports = {
    scheduleDailyQuizGeneration,
    generateDailyQuizzes // Exported for testing purposes
}; 