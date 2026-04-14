import { Module, ServerChannel, UserInfo, Store, schema } from 'modelence/server';
import { AuthError } from 'modelence';
import z from 'zod';
import { getRandomVerses, generateWrongAnswers } from './verses';

// Types
export type QuizQuestion = {
  id: number;
  verseText: string;
  correctAnswer: string;
  options: string[];
  category: string;
};

export type PlayerScore = {
visPlayerId: string;
  visPlayerName: string;
  visScore: number;
  visCorrectAnswers: number;
  visTotalAnswers: number;
  visLastAnswerTime: number | null;
};

export type QuizGame = {
  id?: string;
  sessionCode: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  playerScores: PlayerScore[];
  status: 'waiting' | 'question' | 'answer_reveal' | 'finished';
  questionStartTime: number | null;
  questionEndTime: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type QuizUpdateMessage = {
  type: 'game_started' | 'question_show' | 'player_answered' | 'answer_reveal' | 'next_question' | 'game_finished' | 'scores_updated';
  game?: QuizGame;
  questionIndex?: number;
  correctAnswer?: string;
  playerScores?: PlayerScore[];
};

// Store for quiz games
const dbQuizGames = new Store('quizGames', {
  schema: {
    sessionCode: schema.string(),
    questions: schema.array(schema.object({
      id: schema.number(),
      verseText: schema.string(),
      correctAnswer: schema.string(),
      options: schema.array(schema.string()),
      category: schema.string(),
    })),
    currentQuestionIndex: schema.number(),
    playerScores: schema.array(schema.object({
      visPlayerId: schema.string(),
      visPlayerName: schema.string(),
      visScore: schema.number(),
      visCorrectAnswers: schema.number(),
      visTotalAnswers: schema.number(),
      visLastAnswerTime: schema.number().nullable(),
    })),
    status: schema.string(),
    questionStartTime: schema.number().nullable(),
    questionEndTime: schema.number().nullable(),
    createdAt: schema.date(),
    updatedAt: schema.date(),
  },
  indexes: [
    { key: { sessionCode: 1 }, unique: true },
    { key: { updatedAt: 1 }, expireAfterSeconds: 3600 },
  ]
});

// Server channel for quiz updates
const quizChannel = new ServerChannel<QuizUpdateMessage>(
  'quiz',
  async ({ user }) => !!user
);

// Helper to convert DB doc to game object
function toGame(doc: any): QuizGame {
  return {
    id: doc._id?.toString(),
    sessionCode: doc.sessionCode,
    questions: doc.questions,
    currentQuestionIndex: doc.currentQuestionIndex,
    playerScores: doc.playerScores,
    status: doc.status as QuizGame['status'],
    questionStartTime: doc.questionStartTime,
    questionEndTime: doc.questionEndTime,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Generate quiz questions from verses
function generateQuestions(category: string, count: number = 5): QuizQuestion[] {
  const verses = getRandomVerses(category, count);

  return verses.map((verse, index) => {
    const wrongAnswers = generateWrongAnswers(verse, 3);
    const options = [verse.reference, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      id: index + 1,
      verseText: verse.text,
      correctAnswer: verse.reference,
      options,
      category: verse.category,
    };
  });
}

// Calculate score based on time (faster = more points)
function calculateScore(answerTimeMs: number, isCorrect: boolean): number {
  if (!isCorrect) return 0;

  // Base score for correct answer
  const baseScore = 100;

  // Bonus for speed (max 10 seconds, faster = more bonus)
  const maxTimeBonus = 50;
  const maxTimeMs = 10000; // 10 seconds
  const timeBonus = Math.max(0, Math.floor(maxTimeBonus * (1 - answerTimeMs / maxTimeMs)));

  return baseScore + timeBonus;
}

export default new Module('quiz', {
  stores: [dbQuizGames],
  channels: [quizChannel],

  queries: {
    // Get current game state
    getGame: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const game = await dbQuizGames.findOne({ sessionCode: code });
      if (!game) return null;

      return toGame(game);
    },

    // Get current question (without revealing correct answer to non-answered players)
    getCurrentQuestion: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const game = await dbQuizGames.findOne({ sessionCode: code });
      if (!game || game.status === 'waiting' || game.status === 'finished') {
        return null;
      }

      const currentQuestion = game.questions[game.currentQuestionIndex];
      if (!currentQuestion) return null;

      // Only show correct answer during reveal phase
      const showAnswer = game.status === 'answer_reveal';

      return {
        id: currentQuestion.id,
        verseText: currentQuestion.verseText,
        options: currentQuestion.options,
        correctAnswer: showAnswer ? currentQuestion.correctAnswer : null,
        questionIndex: game.currentQuestionIndex,
        totalQuestions: game.questions.length,
        status: game.status,
        questionStartTime: game.questionStartTime,
      };
    },
  },

  mutations: {
    // Start a new quiz game
    startGame: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { sessionCode, category, questionCount, players } = z.object({
        sessionCode: z.string(),
        category: z.string(),
        questionCount: z.number().min(5).max(20).optional().default(5),
        players: z.array(z.object({
          odPlayerId: z.string(),
          odPlayerName: z.string(),
        })),
      }).parse(args);

      const code = sessionCode.toUpperCase().trim();

      // Delete any existing game for this session
      await dbQuizGames.deleteMany({ sessionCode: code });

      // Generate questions with the selected count
      const questions = generateQuestions(category, questionCount);

      // Initialize player scores
      const playerScores: PlayerScore[] = players.map(p => ({
        visPlayerId: p.odPlayerId,
        visPlayerName: p.odPlayerName,
        visScore: 0,
        visCorrectAnswers: 0,
        visTotalAnswers: 0,
        visLastAnswerTime: null,
      }));

      const now = new Date();
      const newGame = {
        sessionCode: code,
        questions,
        currentQuestionIndex: 0,
        playerScores,
        status: 'question',
        questionStartTime: Date.now(),
        questionEndTime: null,
        createdAt: now,
        updatedAt: now,
      };

      await dbQuizGames.insertOne(newGame);

      const game = await dbQuizGames.findOne({ sessionCode: code });
      const gameObj = toGame(game!);

      // Broadcast game started
      quizChannel.broadcast(code, {
        type: 'game_started',
        game: gameObj,
      });

      // Also broadcast first question
      quizChannel.broadcast(code, {
        type: 'question_show',
        game: gameObj,
        questionIndex: 0,
      });

      return gameObj;
    },

    // Submit an answer
    submitAnswer: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { sessionCode, questionIndex, answer } = z.object({
        sessionCode: z.string(),
        questionIndex: z.number(),
        answer: z.string(),
      }).parse(args);

      const code = sessionCode.toUpperCase().trim();

      const game = await dbQuizGames.findOne({ sessionCode: code });
      if (!game) throw new Error('Game not found');

      if (game.status !== 'question') {
        throw new Error('Not accepting answers right now');
      }

      if (questionIndex !== game.currentQuestionIndex) {
        throw new Error('Wrong question');
      }

      const currentQuestion = game.questions[game.currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;
      const answerTime = Date.now() - (game.questionStartTime || Date.now());
      const score = calculateScore(answerTime, isCorrect);

      // Find player and update their score
      const playerIndex = game.playerScores.findIndex((p: PlayerScore) => p.visPlayerId === user.id);
      if (playerIndex === -1) {
        throw new Error('Player not in game');
      }

      // Check if player already answered this question
      if (game.playerScores[playerIndex].visTotalAnswers > questionIndex) {
        throw new Error('Already answered this question');
      }

      // Update player score
      const updatedScores = [...game.playerScores];
      updatedScores[playerIndex] = {
        ...updatedScores[playerIndex],
        visScore: updatedScores[playerIndex].visScore + score,
        visCorrectAnswers: updatedScores[playerIndex].visCorrectAnswers + (isCorrect ? 1 : 0),
        visTotalAnswers: updatedScores[playerIndex].visTotalAnswers + 1,
        visLastAnswerTime: answerTime,
      };

      await dbQuizGames.updateOne(
        { sessionCode: code },
        { $set: { playerScores: updatedScores, updatedAt: new Date() } }
      );

      // Broadcast score update
      quizChannel.broadcast(code, {
        type: 'player_answered',
        playerScores: updatedScores,
      });

      // Check if all players have answered
      const allAnswered = updatedScores.every((p: PlayerScore) => p.visTotalAnswers > questionIndex);

      if (allAnswered) {
        // Auto-reveal answer after all players answered
        await dbQuizGames.updateOne(
          { sessionCode: code },
          { $set: { status: 'answer_reveal', questionEndTime: Date.now(), updatedAt: new Date() } }
        );

        const updatedGame = await dbQuizGames.findOne({ sessionCode: code });

        quizChannel.broadcast(code, {
          type: 'answer_reveal',
          game: toGame(updatedGame!),
          correctAnswer: currentQuestion.correctAnswer,
        });
      }

      return {
        isCorrect,
        score,
        correctAnswer: isCorrect ? answer : null, // Only reveal if correct
      };
    },

    // Move to next question (host only, or auto after reveal)
    nextQuestion: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const game = await dbQuizGames.findOne({ sessionCode: code });
      if (!game) throw new Error('Game not found');

      const nextIndex = game.currentQuestionIndex + 1;

      if (nextIndex >= game.questions.length) {
        // Game finished
        await dbQuizGames.updateOne(
          { sessionCode: code },
          { $set: { status: 'finished', updatedAt: new Date() } }
        );

        const finalGame = await dbQuizGames.findOne({ sessionCode: code });

        quizChannel.broadcast(code, {
          type: 'game_finished',
          game: toGame(finalGame!),
          playerScores: finalGame!.playerScores,
        });

        return toGame(finalGame!);
      }

      // Move to next question
      await dbQuizGames.updateOne(
        { sessionCode: code },
        {
          $set: {
            currentQuestionIndex: nextIndex,
            status: 'question',
            questionStartTime: Date.now(),
            questionEndTime: null,
            updatedAt: new Date(),
          }
        }
      );

      const updatedGame = await dbQuizGames.findOne({ sessionCode: code });

      quizChannel.broadcast(code, {
        type: 'next_question',
        game: toGame(updatedGame!),
        questionIndex: nextIndex,
      });

      return toGame(updatedGame!);
    },

    // Force reveal answer (for timeout or host action)
    revealAnswer: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const game = await dbQuizGames.findOne({ sessionCode: code });
      if (!game) throw new Error('Game not found');

      if (game.status !== 'question') {
        return toGame(game);
      }

      const currentQuestion = game.questions[game.currentQuestionIndex];

      await dbQuizGames.updateOne(
        { sessionCode: code },
        { $set: { status: 'answer_reveal', questionEndTime: Date.now(), updatedAt: new Date() } }
      );

      const updatedGame = await dbQuizGames.findOne({ sessionCode: code });

      quizChannel.broadcast(code, {
        type: 'answer_reveal',
        game: toGame(updatedGame!),
        correctAnswer: currentQuestion.correctAnswer,
      });

      return toGame(updatedGame!);
    },

    // End session early (host can end the game)
    endSession: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const game = await dbQuizGames.findOne({ sessionCode: code });
      if (!game) throw new Error('Game not found');

      if (game.status === 'finished') {
        return toGame(game);
      }

      // Mark game as finished
      await dbQuizGames.updateOne(
        { sessionCode: code },
        { $set: { status: 'finished', updatedAt: new Date() } }
      );

      const finalGame = await dbQuizGames.findOne({ sessionCode: code });

      quizChannel.broadcast(code, {
        type: 'game_finished',
        game: toGame(finalGame!),
        playerScores: finalGame!.playerScores,
      });

      return toGame(finalGame!);
    },
  },
});
