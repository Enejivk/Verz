import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callMethod } from 'modelence/client';
import { BookOpen, Plus, Users, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';

export default function MultiplayerPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'choice' | 'create' | 'join'>('choice');
  const [sessionCode, setSessionCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      // Generate a 6-character code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create session in database immediately so others can join right away
      await callMethod('multiplayer.createSession', { sessionCode: code });

      setGeneratedCode(code);
      setMode('create');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSession = () => {
    if (sessionCode.length >= 6) {
      // Navigate to waiting room with session code
      navigate(`/multiplayer/session/${sessionCode}`);
    }
  };

  const handleGoToLobby = () => {
    if (!generatedCode) return;
    // Session already created, just navigate to lobby
    navigate(`/multiplayer/session/${generatedCode}`);
  };

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

      {/* Back Navigation */}
      <div className="relative z-20 px-6 md:px-12 py-6">
        <Link to="/dashboard" className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-500">Verz</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Choice Mode */}
          {mode === 'choice' && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  <span className="text-blue-400">Multiplayer</span> Quiz
                </h1>
                <p className="text-gray-400 text-lg">Challenge friends in real-time Bible trivia!</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Create Session */}
                <button
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform mb-6">
                      {isCreating ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <Plus className="w-8 h-8 text-white" />
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Start a Challenge</h2>
                    <p className="text-gray-400 mb-4">
                      Create a quiz challenge and invite friends with a code
                    </p>

                    <div className="flex items-center gap-2 text-blue-400 font-semibold">
                      <span>{isCreating ? 'Creating...' : 'Start Hosting'}</span>
                      {!isCreating && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </div>
                  </div>
                </button>

                {/* Join Session */}
                <button
                  onClick={() => setMode('join')}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform mb-6">
                      <Users className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Join Challenge</h2>
                    <p className="text-gray-400 mb-4">
                      Enter a code to join a friend's quiz challenge
                    </p>

                    <div className="flex items-center gap-2 text-blue-400 font-semibold">
                      <span>Enter Code</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Active Challenges Info */}
              <div className="mt-8 relative bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-gray-400 text-sm">847 active challenges right now</p>
                </div>
                <p className="text-gray-500 text-xs">Test your Scripture knowledge with the community!</p>
              </div>
            </>
          )}

          {/* Create Mode - Show Generated Code */}
          {mode === 'create' && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  Your <span className="bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">Session Code</span>
                </h1>
                <p className="text-gray-400 text-lg">Share this code with your friends - they can join now!</p>
              </div>

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-3xl blur-3xl opacity-50" />

                <div className="relative z-10">
                  {/* Session Active Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">Session is live - friends can join anytime</span>
                  </div>

                  {/* Session Code Display */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-12 py-6 mb-6">
                      <span className="text-6xl font-bold tracking-widest text-white">{generatedCode}</span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Go to Lobby Button */}
                  <Button
                    onClick={handleGoToLobby}
                    className="w-full bg-blue-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-3"
                  >
                    <span>Go to Lobby</span>
                    <ArrowRight className="w-6 h-6" />
                  </Button>

                  <p className="text-center text-gray-400 text-sm mt-4">
                    Enter the lobby to select a topic and start the quiz
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode('choice')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Back
                </button>
              </div>
            </>
          )}

          {/* Join Mode - Enter Code */}
          {mode === 'join' && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">Join</span> a Session
                </h1>
                <p className="text-gray-400 text-lg">Enter the code shared with you</p>
              </div>

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-3xl blur-3xl opacity-50" />

                <div className="relative z-10">
                  <div className="mb-8">
                    <Label htmlFor="session-code" className="block mb-3 text-gray-300 text-lg">
                      Session Code
                    </Label>
                    <Input
                      type="text"
                      id="session-code"
                      value={sessionCode}
                      onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                      placeholder="ABCD12"
                      maxLength={6}
                      className="text-center text-3xl tracking-widest font-bold bg-white/5 border-white/20 text-white placeholder:text-gray-600 focus:border-blue-500/50 py-6"
                    />
                  </div>

                  <Button
                    onClick={handleJoinSession}
                    disabled={sessionCode.length < 6}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Join Session</span>
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setMode('choice');
                    setSessionCode('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
