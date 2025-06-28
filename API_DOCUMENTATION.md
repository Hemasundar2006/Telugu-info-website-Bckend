# Telugu Info Quiz API Documentation

## Overview
The Quiz API provides endpoints to access daily quizzes in multiple topics and languages. Quizzes are automatically generated daily at midnight (IST) using the Open Trivia Database.

## Base URL
```
https://api.telugu-info.com/api
```

## Authentication
Currently, the API endpoints are open and do not require authentication.

## Endpoints

### 1. Get Daily Quiz
Retrieves the daily quiz for a specific topic and language.

```http
GET /quiz?topic={topic}&language={language}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| topic | string | Yes | Quiz topic. Valid values: `aptitude`, `gk`, `reasoning` |
| language | string | Yes | Quiz language. Valid values: `en`, `te` |

#### Response
```json
{
    "success": true,
    "data": {
        "_id": "quiz_id",
        "topic": "aptitude",
        "language": "en",
        "date": "2025-03-15T00:00:00.000Z",
        "questions": [
            {
                "question": "What is 15% of 200?",
                "options": ["25", "30", "35", "40"],
                "_id": "question_id"
            }
            // ... more questions (total 10)
        ],
        "createdAt": "2025-03-15T00:00:00.000Z",
        "updatedAt": "2025-03-15T00:00:00.000Z"
    }
}
```

#### Error Responses
```json
{
    "success": false,
    "message": "Topic and language parameters are required"
}
```
Status: 400 Bad Request

```json
{
    "success": false,
    "message": "Invalid topic. Must be one of: aptitude, gk, reasoning"
}
```
Status: 400 Bad Request

```json
{
    "success": false,
    "message": "Invalid language. Must be one of: en, te"
}
```
Status: 400 Bad Request

```json
{
    "success": false,
    "message": "No quiz found for today with the specified topic and language"
}
```
Status: 404 Not Found

### 2. Validate Quiz Answers
Submit answers for a quiz and get the results.

```http
POST /quiz/validate
```

#### Request Body
```json
{
    "quizId": "quiz_id",
    "answers": ["option1", "option2", "option3", ...]  // Array of selected answers
}
```

#### Response
```json
{
    "success": true,
    "data": {
        "score": 7,
        "totalQuestions": 10,
        "percentage": 70,
        "results": [
            {
                "question": "What is 15% of 200?",
                "userAnswer": "30",
                "correctAnswer": "30",
                "isCorrect": true
            }
            // ... more results
        ]
    }
}
```

#### Error Responses
```json
{
    "success": false,
    "message": "Quiz ID and answers array are required"
}
```
Status: 400 Bad Request

```json
{
    "success": false,
    "message": "Quiz not found"
}
```
Status: 404 Not Found

## Quiz Topics
1. **Aptitude**
   - Mathematical and logical reasoning questions
   - Based on basic arithmetic, percentages, ratios, etc.

2. **General Knowledge (GK)**
   - Current affairs
   - Basic science and history
   - Geography and culture

3. **Reasoning**
   - Logical reasoning
   - Pattern recognition
   - Problem-solving

## Languages
1. **English (en)**
   - Original questions from Open Trivia DB
   - Default language

2. **Telugu (te)**
   - Translated versions of English questions
   - Maintains same difficulty level

## Quiz Generation
- New quizzes are generated daily at midnight (IST)
- Each quiz contains 10 multiple-choice questions
- Questions are fetched from Open Trivia Database
- Telugu translations are provided for Telugu language quizzes

## Rate Limiting
Currently, there are no rate limits implemented on the API endpoints.

## Error Codes
| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Quiz not found |
| 500 | Internal Server Error |

## Example Usage

### JavaScript/Node.js
```javascript
// Get a quiz
const getQuiz = async () => {
    const response = await fetch('https://api.telugu-info.com/api/quiz?topic=aptitude&language=en');
    const data = await response.json();
    return data;
};

// Submit answers
const submitAnswers = async (quizId, answers) => {
    const response = await fetch('https://api.telugu-info.com/api/quiz/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quizId,
            answers
        })
    });
    const data = await response.json();
    return data;
};
```

### Python
```python
import requests

# Get a quiz
def get_quiz():
    response = requests.get('https://api.telugu-info.com/api/quiz', 
                          params={'topic': 'aptitude', 'language': 'en'})
    return response.json()

# Submit answers
def submit_answers(quiz_id, answers):
    response = requests.post('https://api.telugu-info.com/api/quiz/validate',
                           json={'quizId': quiz_id, 'answers': answers})
    return response.json()
```

## Best Practices
1. Always validate the required parameters before making API calls
2. Handle API errors appropriately in your application
3. Cache quiz data on the client side to reduce API calls
4. Implement proper error handling for network issues

## Support
For any issues or questions, please contact:
- Email: marotinani06@gmail.com
- Phone: 917036180813
- Website: https://telugu-info.vercel.app/ 