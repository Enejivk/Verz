import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { callMethod } from 'modelence/client';
import { useSession } from 'modelence/client';
import { BookOpen, Trophy, CheckCircle2, XCircle, Users, Crown, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import type { QuizGame, QuizUpdateMessage } from '@/server/quiz';
import quizClientChannel, { subscribeToQuizUpdates } from '@/client/channels/quizChannel';

type CurrentQuestion = {
  id: number;
  verseText: string;
  options: string[];
  correctAnswer: string | null;
  questionIndex: number;
  totalQuestions: number;
  status: string;
  questionStartTime: number | null;
};

// Question time limit in seconds
const QUESTION_TIME_LIMIT = 15;
// Polling interval in milliseconds
const POLL_INTERVAL = 2000;

export default function MultiplayerQuizPage() {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const { user } = useSession();

  const [game, setGame] = useState<QuizGame | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; score: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [endingSession, setEndingSession] = useState(false);

  const channelJoinedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle WebSocket messages
  const handleQuizMessage = useCallback((message: QuizUpdateMessage) => {
    console.log('Quiz message:', message);

    if (message.game) {
      setGame(message.game);
    }

    if (message.playerScores) {
      setGame(prev => prev ? { ...prev, playerScores: message.playerScores! } : null);
    }

    switch (message.type) {
      case 'game_started':
      case 'question_show':
      case 'next_question':
        // Reset state for new question
        setSelectedAnswer(null);
        setAnswerResult(null);
        setTimeLeft(10);
        setShowLeaderboard(false);
        // Fetch fresh question data
        fetchCurrentQuestion();
        break;

      case 'player_answered':
        // Just update scores, already handled above
        break;

      case 'answer_reveal':
        setShowLeaderboard(true);
        // Update current question with correct answer
        if (message.correctAnswer) {
          setCurrentQuestion(prev => prev ? { ...prev, correctAnswer: message.correctAnswer!, status: 'answer_reveal' } : null);
        }
        break;

      case 'game_finished':
        setShowLeaderboard(true);
        break;
    }
  }, []);

  // Fetch current question and game state
  const fetchCurrentQuestion = useCallback(async () => {
    if (!sessionCode) return;
    try {
      const code = sessionCode.toUpperCase().trim();

      // Fetch both game and question data
      const [gameData, question] = await Promise.all([
        callMethod<QuizGame | null>('quiz.getGame', { sessionCode: code }),
        callMethod<CurrentQuestion | null>('quiz.getCurrentQuestion', { sessionCode: code })
      ]);

      if (gameData) {
        setGame(gameData);
      }

      if (question) {
        // Check if this is a new question (different index)
        setCurrentQuestion(prev => {
          if (!prev || prev.questionIndex !== question.questionIndex) {
            // New question - reset state
            setSelectedAnswer(null);
            setAnswerResult(null);
            setShowLeaderboard(false);
          }
          return question;
        });

        // Calculate time left based on question start time
        if (question.questionStartTime && question.status === 'question') {
          const elapsed = (Date.now() - question.questionStartTime) / 1000;
          setTimeLeft(Math.max(0, QUESTION_TIME_LIMIT - Math.floor(elapsed)));
        }

        // Show leaderboard during answer reveal
        if (question.status === 'answer_reveal') {
          setShowLeaderboard(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch question:', err);
    }
  }, [sessionCode]);

  // Subscribe to quiz updates
  useEffect(() => {
    const unsubscribe = subscribeToQuizUpdates(handleQuizMessage);
    return () => unsubscribe();
  }, [handleQuizMessage]);

  // Join channel and initialize game
  useEffect(() => {
    if (!sessionCode || !user) return;

    const code = sessionCode.toUpperCase().trim();

    // Join quiz WebSocket channel
    if (!channelJoinedRef.current) {
      channelJoinedRef.current = true;
      console.log('Joining quiz channel:', code);
      quizClientChannel.joinChannel(code);
    }

    // Load initial game state
    const initGame = async () => {
      try {
        setLoading(true);

        const gameData = await callMethod<QuizGame | null>('quiz.getGame', { sessionCode: code });

        if (gameData) {
          setGame(gameData);
          await fetchCurrentQuestion();
        } else {
          // Game doesn't exist yet - might need to wait for host to start
          console.log('No game found, waiting for host to start...');
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to load game:', err);
        setLoading(false);
      }
    };

    initGame();

    return () => {
      if (channelJoinedRef.current) {
        quizClientChannel.leaveChannel(code);
        channelJoinedRef.current = false;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionCode, user, fetchCurrentQuestion]);

  // Polling for game state updates
  useEffect(() => {
    if (!sessionCode || loading) return;

    console.log('[QuizPage] Starting polling for game updates');
    pollIntervalRef.current = setInterval(() => {
      fetchCurrentQuestion();
    }, POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        console.log('[QuizPage] Stopping polling');
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [sessionCode, loading, fetchCurrentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (!currentQuestion || currentQuestion.status !== 'question' || selectedAnswer) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto reveal
          if (sessionCode) {
            callMethod('quiz.revealAnswer', { sessionCode }).catch(console.error);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, selectedAnswer, sessionCode]);

  // Handle answer selection
  const handleSelectAnswer = async (answer: string) => {
    if (!sessionCode || !currentQuestion || selectedAnswer || submitting) return;

    setSelectedAnswer(answer);
    setSubmitting(true);

    try {
      const result = await callMethod<{ isCorrect: boolean; score: number }>('quiz.submitAnswer', {
        sessionCode,
        questionIndex: currentQuestion.questionIndex,
        answer,
      });

      setAnswerResult(result);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      // Still mark as selected to prevent multiple submissions
    } finally {
      setSubmitting(false);
    }
  };

  // Handle next question (host only)
  const handleNextQuestion = async () => {
    if (!sessionCode) return;

    try {
      await callMethod('quiz.nextQuestion', { sessionCode });
    } catch (err) {
      console.error('Failed to advance question:', err);
    }
  };

  // Handle end session
  const handleEndSession = async () => {
    if (!sessionCode || endingSession) return;

    setEndingSession(true);
    try {
      await callMethod('quiz.endSession', { sessionCode });
    } catch (err) {
      console.error('Failed to end session:', err);
    } finally {
      setEndingSession(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Waiting for game to start
  if (!game || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Waiting for game to start...</p>
        </div>
      </div>
    );
  }

  // Game finished
  if (game.status === 'finished') {
    const sortedScores = [...game.playerScores].sort((a, b) => b.visScore - a.visScore);
    const winner = sortedScores[0];

    return (
      <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden relative" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-600/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
          <h1 className="text-5xl font-bold mb-2">Session Complete!</h1>
          <p className="text-xl text-gray-400 mb-8">
            {winner?.visPlayerId === user?.id ? "You led the group!" : `${winner?.visPlayerName} led the group!`}
          </p>

          {/* Final Leaderboard */}
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Final Scores
            </h2>
            <div className="space-y-3">
              {sortedScores.map((player, index) => (
                <div
                  key={player.visPlayerId}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    index === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                    player.visPlayerId === user?.id ? 'bg-blue-500/20 border border-blue-500/30' :
                    'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${index === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      #{index + 1}
                    </span>
                    {index === 0 && <Crown className="w-5 h-5 text-yellow-400" />}
                    <span className="font-semibold">{player.visPlayerName}</span>
                    {player.visPlayerId === user?.id && (
                      <span className="text-xs text-blue-400">(You)</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{player.visScore}</p>
                    <p className="text-xs text-gray-400">{player.visCorrectAnswers}/{game.questions.length} correct</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/play/multiplayer">
              <Button className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 font-semibold">Start New Session</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 font-semibold">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isHost = game.playerScores[0]?.visPlayerId === user?.id; // First player is usually host
  const sortedScores = [...game.playerScores].sort((a, b) => b.visScore - a.visScore);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden relative" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-20 px-6 py-4 flex justify-between items-center border-b border-white/10">
        <Link to="/dashboard" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-500">Verz</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">Question</p>
            <p className="font-bold">{currentQuestion.questionIndex + 1} / {currentQuestion.totalQuestions}</p>
          </div>

          {/* Timer */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${
            timeLeft <= 3 ? 'border-red-500 text-red-400' : 'border-blue-500 text-blue-400'
          }`}>
            <span className="text-xl font-bold">{timeLeft}</span>
          </div>

          {/* End Session Button */}
          <Button
            onClick={handleEndSession}
            disabled={endingSession}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 text-sm font-semibold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">End Session</span>
          </Button>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-4">Which book is this from?</p>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed">
              "{currentQuestion.verseText}"
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = currentQuestion.correctAnswer === option;
              const showResult = currentQuestion.status === 'answer_reveal' || answerResult;

              let buttonClass = 'bg-white/10 border-white/20 hover:bg-white/20';

              if (showResult) {
                if (isCorrect) {
                  buttonClass = 'bg-green-500/30 border-green-500 text-green-300';
                } else if (isSelected && !isCorrect) {
                  buttonClass = 'bg-red-500/30 border-red-500 text-red-300';
                }
              } else if (isSelected) {
                buttonClass = 'bg-blue-500/30 border-blue-500';
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={!!selectedAnswer || currentQuestion.status === 'answer_reveal' || submitting}
                  className={`
                    p-6 rounded-2xl border-2 transition-all text-left
                    disabled:cursor-not-allowed
                    ${buttonClass}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg font-semibold flex-1">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Answer Result */}
          {answerResult && (
            <div className={`text-center mb-8 p-4 rounded-xl ${
              answerResult.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <p className="text-2xl font-bold">
                {answerResult.isCorrect ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-7 h-7 text-green-400" />
                    Correct!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <XCircle className="w-7 h-7 text-red-400" />
                    Wrong!
                  </span>
                )}
              </p>
              {answerResult.isCorrect && (
                <p className="text-blue-400">+{answerResult.score} points</p>
              )}
            </div>
          )}

          {/* Leaderboard / Next Button */}
          {(showLeaderboard || currentQuestion.status === 'answer_reveal') && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Live Scores
                </h3>
                {isHost && (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {currentQuestion.questionIndex + 1 >= currentQuestion.totalQuestions ? 'See Results' : 'Next Question'}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {sortedScores.map((player, index) => (
                  <div
                    key={player.visPlayerId}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      player.visPlayerId === user?.id ? 'bg-blue-500/20' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <span className="font-medium">{player.visPlayerName}</span>
                      {player.visPlayerId === user?.id && (
                        <span className="text-xs text-blue-400">(You)</span>
                      )}
                    </div>
                    <span className="text-xl font-bold">{player.visScore}</span>
                  </div>
                ))}
              </div>

              {!isHost && (
                <p className="text-center text-gray-400 text-sm mt-4">
                  Waiting for host to continue...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
