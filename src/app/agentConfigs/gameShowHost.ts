import { RealtimeAgent, tool } from '@openai/agents/realtime';

const gameQuestions = [
  {
    question: "What's the capital of France?",
    options: ["A) London", "B) Berlin", "C) Paris", "D) Madrid"],
    correct: "C",
    points: 100
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["A) Venus", "B) Mars", "C) Jupiter", "D) Saturn"],
    correct: "B",
    points: 200
  },
  {
    question: "What's 15 × 7?",
    options: ["A) 95", "B) 105", "C) 115", "D) 125"],
    correct: "B",
    points: 150
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["A) Van Gogh", "B) Picasso", "C) Da Vinci", "D) Monet"],
    correct: "C",
    points: 250
  },
  {
    question: "What's the largest ocean on Earth?",
    options: ["A) Atlantic", "B) Indian", "C) Arctic", "D) Pacific"],
    correct: "D",
    points: 300
  }
];

let currentScore = 0;
let questionsAsked = 0;
let currentQuestion: any = null;

export const gameShowHostAgent = new RealtimeAgent({
  name: 'gameShowHost',
  voice: 'sage',
  instructions: `You are an energetic, charismatic game show host! Your personality is upbeat, encouraging, and theatrical - think of classic game show hosts like Alex Trebek or Pat Sajak.

PERSONALITY TRAITS:
- Always speak with enthusiasm and energy
- Use game show catchphrases like "Come on down!", "That's correct!", "Ooh, so close!"
- Build suspense when revealing answers
- Celebrate correct answers enthusiastically
- Encourage players when they get wrong answers
- Use dramatic pauses for effect

GAME RULES:
- Welcome new contestants warmly
- Ask trivia questions one at a time
- Give multiple choice options (A, B, C, D)
- Award points for correct answers
- Keep track of the running score
- Provide encouraging feedback
- After 5 questions, announce final score and celebrate

SPEAKING STYLE:
- Use exclamation points frequently!
- Draw out words for drama: "Thaaaat's... CORRECT!"
- Use phrases like "Ladies and gentlemen", "Folks", "Contestants"
- Build anticipation: "Is that your final answer?"
- Celebrate achievements: "Fantastic!" "Outstanding!" "You're on fire!"

Always maintain high energy and make the experience fun and engaging!`,
  
  tools: [
    tool({
      name: 'startNewGame',
      description: 'Start a new game session, resetting score and questions',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false
      },
      execute: async () => {
        currentScore = 0;
        questionsAsked = 0;
        currentQuestion = null;
        return { message: "New game started! Score reset to 0." };
      }
    }),
    
    tool({
      name: 'askQuestion',
      description: 'Ask the next trivia question',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false
      },
      execute: async () => {
        if (questionsAsked >= 5) {
          return { 
            message: "Game complete! No more questions available.",
            gameComplete: true,
            finalScore: currentScore 
          };
        }
        
        currentQuestion = gameQuestions[questionsAsked];
        questionsAsked++;
        
        return {
          question: currentQuestion.question,
          options: currentQuestion.options,
          questionNumber: questionsAsked,
          totalQuestions: 5,
          possiblePoints: currentQuestion.points
        };
      }
    }),
    
    tool({
      name: 'checkAnswer',
      description: 'Check if the contestant\'s answer is correct',
      parameters: {
        type: 'object',
        properties: {
          answer: {
            type: 'string',
            description: 'The contestant\'s answer (A, B, C, or D)'
          }
        },
        required: ['answer'],
        additionalProperties: false
      },
      execute: async (input: any) => {
        if (!currentQuestion) {
          return { message: "No question is currently active. Please ask a question first!" };
        }
        
        const isCorrect = input.answer.toUpperCase() === currentQuestion.correct;
        
        if (isCorrect) {
          currentScore += currentQuestion.points;
        }
        
        const result = {
          correct: isCorrect,
          correctAnswer: currentQuestion.correct,
          pointsEarned: isCorrect ? currentQuestion.points : 0,
          currentScore: currentScore,
          explanation: `The correct answer was ${currentQuestion.correct}`,
          gameComplete: questionsAsked >= 5
        };
        
        currentQuestion = null;
        
        return result;
      }
    }),
    
    tool({
      name: 'getScore',
      description: 'Get the current game score and progress',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false
      },
      execute: async () => {
        return {
          currentScore: currentScore,
          questionsAnswered: questionsAsked,
          totalQuestions: 5,
          questionsRemaining: 5 - questionsAsked
        };
      }
    })
  ],
  
  handoffs: []
});

export const gameShowScenario = [gameShowHostAgent];