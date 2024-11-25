// Import required modules
const axios = require('axios');
const { ActivityHandler } = require('botbuilder');

// Gemini API configuration
const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/{model=models/*}:generateText'; // Replace with actual Gemini API endpoint
const geminiApiKey = process.env.GEMINI_API_KEY;

// Database mockup (replace with actual DB logic)
const db = [];

// Interview Bot logic
class InterviewBot extends ActivityHandler {
  constructor(jobDescription) {
    super();
    this.jobDescription = jobDescription;
    this.questionCount = 0;
    this.maxQuestions = 10;

    this.onMessage(async (context, next) => {
      const userAnswer = context.activity.text;
      console.log(User answer:${userAnswer});

      const { summary, nextQuestion } = await this.processAnswer(userAnswer);

      db.push({ question: context.activity.replyToId, answer: userAnswer, summary });

      if (this.questionCount >= this.maxQuestions) {
        await context.sendActivity('Thank you for your responses! The interview is complete.');
      } else {
        this.questionCount++;
        await context.sendActivity(nextQuestion);
      }

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      await context.sendActivity('Tell me about yourself.');
      this.questionCount++;
      await next();
    });
  }

  async processAnswer(answer) {
    try {
      const prompt = `
Job Description: ${this.jobDescription}
User's Answer: ${answer}
Summarize the user's answer and suggest the next question:
`;

      // Send request to Gemini API for completion
      const response = await axios.post(geminiApiUrl, {
        apiKey: geminiApiKey,
        prompt: prompt,
        max_tokens: 300,  // You can adjust the max tokens based on Gemini's API limits
      });

      // Assuming Gemini API returns the response in a format similar to OpenAI's
      const completionText = response.data.choices[0].text.trim();
      const [summary, nextQuestion] = completionText.split('\n').map((line) => line.trim());

      return { summary, nextQuestion };
    } catch (error) {
      console.error('Error processing answer:', error);
      return {
        summary: 'Unable to generate a summary.',
        nextQuestion: 'What motivates you in your career?',
      };
    }
  }
}

module.exports = InterviewBot;