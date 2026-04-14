import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { callMethod } from 'modelence/client';
import { useSession } from 'modelence/client';
import { BookOpen, Users, Crown, Check, Copy, Shuffle, ArrowRight, Loader2, AlertCircle, Flame, Heart, Lightbulb, Sparkles, Gem, Star, Coins, Hand, LucideIcon, Hash } from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import type { MultiplayerSession, SessionUpdateMessage } from '@/server/multiplayer';
import multiplayerClientChannel, { subscribeToSessionUpdates } from '@/client/channels/multiplayerChannel';

type Category = {
  id: string;
  name: string;
  Icon: LucideIcon;
};

const categories: Category[] = [
  { id: 'faith', name: 'Faith', Icon: Flame },
  { id: 'love', name: 'Love', Icon: Heart },
  { id: 'wisdom', name: 'Wisdom', Icon: Lightbulb },
  { id: 'healing', name: 'Healing', Icon: Sparkles },
  { id: 'marriage', name: 'Marriage', Icon: Gem },
  { id: 'grace', name: 'Grace', Icon: Star },
  { id: 'prosperity', name: 'Prosperity', Icon: Coins },
  { id: 'salvation', name: 'Salvation', Icon: Hand },
];

const questionCountOptions = [5, 10, 15, 20];

// Polling interval in milliseconds (3 seconds)
const POLL_INTERVAL = 3000;

export default function MultiplayerLobbyPage() {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const { user } = useSession();

  const [session, setSession] = useState<MultiplayerSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Track if we've already initialized the session data
  const initializedRef = useRef(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch latest session data
  const refreshSession = useCallback(async () => {
    if (!sessionCode) return;

    try {
      const code = sessionCode.toUpperCase().trim();
      const sessionData = await callMethod<MultiplayerSession | null>('multiplayer.getSession', { sessionCode: code });

      if (sessionData) {
        setSession(sessionData);

        // If game has started, navigate to quiz
        if (sessionData.status === 'starting' || sessionData.status === 'active') {
          console.log('[LobbyPage] Game started, navigating to quiz...');
          navigate(`/quiz/multiplayer/${code}`);
        }
      }
    } catch (err) {
      console.error('Failed to refresh session:', err);
    }
  }, [sessionCode, navigate]);

  // Handle WebSocket messages - update session state in real-time
  const handleWebSocketMessage = useCallback((message: SessionUpdateMessage) => {
    console.log('[LobbyPage] WebSocket message received:', message.type);

    // Always update session when we receive session data
    if (message.session) {
      console.log('[LobbyPage] Updating session with', message.session.players.length, 'players');
      setSession(message.session);
    }

    // Handle specific message types
    switch (message.type) {
      case 'player_joined':
        console.log(`[LobbyPage] Player joined: ${message.odPlayerName}`);
        break;
      case 'player_left':
        console.log(`Player left: ${message.odPlayerName}`);
        break;
      case 'category_selected':
        console.log(`Category selected: ${message.category}`);
        break;
      case 'session_closed':
        console.log('Session has been closed');
        setError('Session has been closed by the host');
        break;
      case 'game_starting':
        console.log('Game is starting!');
        // Navigate to quiz page after short delay
        if (sessionCode) {
          setTimeout(() => {
            navigate(`/quiz/multiplayer/${sessionCode.toUpperCase()}`);
          }, 2000);
        }
        break;
    }
  }, [sessionCode, navigate]);

  // Subscribe to WebSocket updates - runs once on mount
  useEffect(() => {
    console.log('[LobbyPage] Subscribing to session updates...');
    const unsubscribe = subscribeToSessionUpdates(handleWebSocketMessage);
    return () => {
      console.log('[LobbyPage] Unsubscribing from session updates');
      unsubscribe();
    };
  }, [handleWebSocketMessage]);

  // Join WebSocket channel - separate effect that runs when sessionCode is available
  useEffect(() => {
    if (!sessionCode) {
      console.log('[LobbyPage] No sessionCode, skipping channel join');
      return;
    }

    const code = sessionCode.toUpperCase().trim();
    console.log('[LobbyPage] Joining WebSocket channel:', code);
    multiplayerClientChannel.joinChannel(code);

    // Cleanup - leave channel on unmount
    return () => {
      console.log('[LobbyPage] Leaving WebSocket channel:', code);
      multiplayerClientChannel.leaveChannel(code);
    };
  }, [sessionCode]);

  // Load session data - separate effect for data initialization
  useEffect(() => {
    if (!sessionCode || !user) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const code = sessionCode.toUpperCase().trim();

    const initSession = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check if session exists
        let sessionData = await callMethod<MultiplayerSession | null>('multiplayer.getSession', { sessionCode: code });

        if (sessionData) {
          // Session exists, check if we're already in it
          console.log('[LobbyPage] Session hostId:', sessionData.hostId, 'User id:', user.id);
          console.log('[LobbyPage] Players:', sessionData.players.map(p => p.odPlayerId));
          const isInSession = sessionData.players.some(p => p.odPlayerId === user.id);

          if (!isInSession) {
            // Not in session, try to join
            console.log('Joining session...');
            sessionData = await callMethod<MultiplayerSession>('multiplayer.joinSession', { sessionCode: code });
          } else {
            console.log('Already in session');
          }

          setSession(sessionData);
        } else {
          // Session doesn't exist
          setError('Session not found. It may have expired or been closed.');
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize session:', err);
        setError((err as Error).message);
        setLoading(false);
      }
    };

    initSession();
  }, [sessionCode, user]);

  // Polling fallback - refresh session data periodically
  // This ensures UI updates even if WebSocket isn't working
  useEffect(() => {
    if (!sessionCode || loading) return;

    // Start polling
    console.log('[LobbyPage] Starting polling for session updates');
    pollIntervalRef.current = setInterval(() => {
      refreshSession();
    }, POLL_INTERVAL);

    // Cleanup - stop polling on unmount
    return () => {
      if (pollIntervalRef.current) {
        console.log('[LobbyPage] Stopping polling');
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [sessionCode, loading, refreshSession]);

  // Handle explicit leave (when user clicks leave button)
  const handleLeaveSession = async () => {
    if (!sessionCode) return;

    try {
      setActionLoading(true);
      await callMethod('multiplayer.leaveSession', { sessionCode });
      navigate('/play/multiplayer');
    } catch (err) {
      console.error('Failed to leave session:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode.toUpperCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectCategory = async (categoryId: string) => {
    if (!sessionCode) return;

    try {
      setActionLoading(true);
      const updatedSession = await callMethod<MultiplayerSession>('multiplayer.selectCategory', { sessionCode, category: categoryId });
      // Update local state immediately
      setSession(updatedSession);
    } catch (err) {
      console.error('Failed to select category:', err);
      alert('Failed to select category: ' + (err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRandomCategory = () => {
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    handleSelectCategory(randomCat.id);
  };

  const handleSetQuestionCount = async (count: number) => {
    if (!sessionCode) return;

    try {
      setActionLoading(true);
      const updatedSession = await callMethod<MultiplayerSession>('multiplayer.setQuestionCount', { sessionCode, questionCount: count });
      setSession(updatedSession);
    } catch (err) {
      console.error('Failed to set question count:', err);
    } finally {
      setActionLoading(false);
    }
  };


  const handleStartGame = async () => {
    if (!sessionCode || !session) return;

    try {
      setActionLoading(true);

      // Update multiplayer session status
      await callMethod('multiplayer.startGame', { sessionCode });

      // Start the quiz game with players
      await callMethod('quiz.startGame', {
        sessionCode,
        category: session.category,
        questionCount: session.questionCount,
        players: session.players.map(p => ({
          odPlayerId: p.odPlayerId,
          odPlayerName: p.odPlayerName,
        })),
      });

      // Navigate to quiz page
      navigate(`/quiz/multiplayer/${sessionCode.toUpperCase()}`);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Session Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Session not found'}</p>
          <Link to="/play/multiplayer">
            <Button className="bg-blue-500 hover:bg-blue-600">Back to Multiplayer</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine user status
  const isHost = session.hostId === user?.id;
  console.log('[LobbyPage] isHost check:', session.hostId, '===', user?.id, '=', isHost);
  const selectedCategory = categories.find(c => c.id === session.category);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden relative" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <div className="relative z-20 px-6 md:px-12 py-6 flex justify-between items-center">
        <Link to="/dashboard" className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-500">Verz</span>
        </Link>

        <button
          onClick={handleLeaveSession}
          disabled={actionLoading}
          className="text-gray-400 hover:text-red-400 transition-colors text-sm"
        >
          Leave Session
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header with Session Code */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-blue-400">Quiz Challenge</span> Lobby
            </h1>

            <div className="inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-8 py-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Session Code</p>
                <p className="text-4xl font-bold tracking-widest">{session.sessionCode}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-gray-400">Share this code with your friends to join</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Players List */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">Players ({session.players.length})</h2>
              </div>

              <div className="space-y-3">
                {session.players.map((player) => (
                  <div
                    key={player.odPlayerId}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      player.odPlayerId === user?.id
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {player.odIsHost && <Crown className="w-5 h-5 text-yellow-400" />}
                      <span className="font-semibold">{player.odPlayerName}</span>
                      {player.odPlayerId === user?.id && (
                        <span className="text-xs text-blue-400">(You)</span>
                      )}
                      {player.odIsHost && <span className="text-xs text-yellow-400">(Host)</span>}
                    </div>
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-6">Topic</h2>

              {/* Selected Category Display */}
              {selectedCategory ? (
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <selectedCategory.Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{selectedCategory.name}</h3>
                  {isHost && (
                    <button
                      onClick={handleRandomCategory}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Change</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center mb-6">
                  <p className="text-gray-400 mb-4">No topic selected yet</p>
                  {isHost && (
                    <button
                      onClick={handleRandomCategory}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-xl font-semibold"
                    >
                      <Shuffle className="w-5 h-5" />
                      <span>Pick Random Topic</span>
                    </button>
                  )}
                </div>
              )}

              {/* Category Grid (Host only) */}
              {isHost && (
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      disabled={actionLoading}
                      className={`
                        p-3 rounded-xl transition-all text-center
                        ${session.category === cat.id
                          ? 'bg-blue-500/30 border-2 border-blue-400'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'}
                      `}
                    >
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                        <cat.Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-xs font-medium">{cat.name}</p>
                    </button>
                  ))}
                </div>
              )}

              {!isHost && !selectedCategory && (
                <p className="text-gray-500 text-sm text-center">Waiting for host to select a topic...</p>
              )}
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Hash className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Number of Questions</h2>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {isHost ? 'Select how many verses you want to be quizzed on' : `The host has selected ${session.questionCount} questions`}
            </p>

            {isHost ? (
              <div className="grid grid-cols-4 gap-3">
                {questionCountOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => handleSetQuestionCount(count)}
                    disabled={actionLoading}
                    className={`
                      p-4 rounded-xl transition-all text-center font-bold text-xl
                      ${session.questionCount === count
                        ? 'bg-blue-500 border-2 border-blue-400 text-white'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'}
                    `}
                  >
                    {count}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl px-8 py-4">
                  <span className="text-4xl font-bold text-blue-400">{session.questionCount}</span>
                  <span className="text-gray-400 ml-2">questions</span>
                </div>
              </div>
            )}
          </div>

          {/* Start Game Button (Host only) */}
          {isHost && (
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <Button
                onClick={handleStartGame}
                disabled={!session.category || actionLoading}
                className="w-full bg-blue-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Starting...</span>
                  </>
                ) : session.status === 'starting' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Starting Game...</span>
                  </>
                ) : (
                  <>
                    <span>Start Quiz</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </Button>

              {!session.category && (
                <p className="text-center text-gray-400 text-sm mt-4">Please select a topic first</p>
              )}
            </div>
          )}

          {/* Waiting message for non-hosts */}
          {!isHost && (
            <div className="text-center p-8">
              {session.status === 'starting' ? (
                <>
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-blue-400 font-semibold">Game is starting!</p>
                </>
              ) : (
                <>
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Waiting for host to begin the session...</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
