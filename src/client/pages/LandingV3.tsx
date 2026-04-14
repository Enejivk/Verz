import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from 'modelence/client';
import { BookOpen, Users, Zap, Play, Target, Sparkles, ChevronRight, Timer, Flame, Heart, Lightbulb, Star, Gem, Check, Trophy, Swords, Radio } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingV3() {
  const { isDark } = useTheme();
  const { user } = useSession();
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(2847);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const liveMatches = [
    { player1: "Grace_Seeker", player2: "FaithfulOne", topic: "Faith", score: "4-3" },
    { player1: "WordExplorer", player2: "ScriptureKid", topic: "Love", score: "2-2" },
    { player1: "BibleChamp", player2: "VerseMaster", topic: "Wisdom", score: "5-4" },
    { player1: "TruthSeeker", player2: "HolyReader", topic: "Grace", score: "3-1" },
  ];

  const topics = [
    { name: "Faith", Icon: Flame },
    { name: "Love", Icon: Heart },
    { name: "Wisdom", Icon: Lightbulb },
    { name: "Healing", Icon: Sparkles },
    { name: "Grace", Icon: Gem },
    { name: "Salvation", Icon: Star },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a12] text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`} style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-32 w-96 h-96 ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/20'} rounded-full blur-[120px] animate-pulse`} />
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 ${isDark ? 'bg-purple-600/20' : 'bg-purple-400/15'} rounded-full blur-[120px] animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'} rounded-full blur-[150px]`} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 ${isDark ? 'border-[#0a0a12]' : 'border-gray-50'} animate-pulse`} />
          </div>
          <span className="text-2xl font-bold text-blue-500">Verz</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <div className={`hidden md:flex items-center gap-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} backdrop-blur-sm border rounded-full px-4 py-2`}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{playerCount.toLocaleString()} playing now</span>
          </div>
          <Link to="/login" className={`hidden sm:block ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors px-4 py-2`}>
            Sign In
          </Link>
          <Link to="/signup" className="bg-blue-500 hover:bg-blue-400 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-blue-500/30 transition-all">
            Play Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 pt-8 sm:pt-16 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-100 border-purple-200'} border rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8`}>
                <Swords className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Real-Time Multiplayer Bible Battles</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Not Your</span>
                <br />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Typical</span>
                <br />
                <span className="text-blue-500">Bible Quiz.</span>
              </h1>

              <p className={`text-lg sm:text-xl max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                One quotes the verse. The other names the book. The game we played with friends — now anyone, anywhere.
              </p>

              <Link to="/signup" className="group relative inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg overflow-hidden hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                <Users className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Challenge a Friend</span>
              </Link>

              {/* Quick Stats */}
              <div className={`flex justify-center lg:justify-start gap-4 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="text-center">
                  <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>50K+</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Active Players</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-500">LIVE</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Multiplayer</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>160+</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Verse Challenges</p>
                </div>
              </div>
            </div>

            {/* Right - Live Matches Preview */}
            <div className="relative hidden lg:block">
              <div className={`absolute inset-0 ${isDark ? 'bg-purple-600/20' : 'bg-purple-400/20'} rounded-3xl blur-3xl`} />

              <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-3xl p-6 sm:p-8 shadow-2xl`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-pulse" />
                    <span className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Matches</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm font-semibold">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    LIVE NOW
                  </div>
                </div>

                <div className="space-y-3">
                  {liveMatches.map((match, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all ${
                        idx === 0 ? 'bg-purple-500/20 border border-purple-500/30' : isDark ? 'bg-white/5' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <span className={`text-sm sm:text-base font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{match.player1}</span>
                          <Swords className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                          <span className={`text-sm sm:text-base font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{match.player2}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>{match.topic}</span>
                        </div>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-purple-400 flex-shrink-0">
                        {match.score}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} text-center`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Join a match and compete in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <div className={`relative ${isDark ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-gray-200'} backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 border`}>
            <div className="text-center mb-4 sm:mb-8">
              <span className={`inline-block text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full mb-4 ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                WHY VERZ IS DIFFERENT
              </span>
            </div>
            <p className={`text-lg sm:text-2xl md:text-3xl leading-relaxed text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Born from a simple game with friends — quote a verse, guess the book. After a few rounds, <span className="text-purple-500 font-bold">you remember verses instinctively</span>. Now play with anyone, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* How Multiplayer Works */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Real-Time </span>
              <span className="text-purple-500">Scripture Battles</span>
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>See a verse. Name the book. Beat your friend.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-2xl sm:rounded-3xl p-6 sm:p-8`}>
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-lg shadow-purple-500/30">1</div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Challenge Someone</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Share a code with friends and pick a topic.</p>
            </div>

            {/* Step 2 */}
            <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-2xl sm:rounded-3xl p-6 sm:p-8`}>
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-lg shadow-blue-500/30">2</div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Timer className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Race the Clock</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Same verse, same time. Answer fast to score.</p>
            </div>

            {/* Step 3 */}
            <div className={`relative sm:col-span-2 md:col-span-1 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-2xl sm:rounded-3xl p-6 sm:p-8`}>
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-lg shadow-green-500/30">3</div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Claim Victory</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Most points wins. Climb the leaderboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Battle Modes */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Battle </span>
              <span className="text-blue-500">Modes</span>
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Choose how you want to test your Scripture knowledge</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Multiplayer Mode */}
            <div className={`group relative ${isDark ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/10 border-purple-500/30 hover:border-purple-500/50' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300'} backdrop-blur-sm border-2 rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all overflow-hidden`}>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 sm:px-3 py-1 bg-purple-500 text-white rounded-full">
                  <Zap className="w-3 h-3" /> FEATURED
                </span>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Multiplayer Battle</h3>
                <p className={`text-sm sm:text-base mb-4 sm:mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Challenge friends or strangers. See who knows Scripture best — just like the game, but now online.</p>

                <div className={`${isDark ? 'bg-black/30 border-white/5' : 'bg-white border-gray-200'} rounded-xl p-3 sm:p-4 border`}>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You vs Opponent</span>
                    <span className="text-xs text-purple-400 font-semibold">LIVE</span>
                  </div>
                  <p className={`text-sm sm:text-base italic ${isDark ? 'text-white' : 'text-gray-900'}`}>"For God so loved the world..."</p>
                  <div className="flex flex-wrap justify-between items-center gap-2 mt-3 sm:mt-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <span className={`px-2 sm:px-3 py-1 ${isDark ? 'bg-white/10' : 'bg-gray-100'} rounded-lg text-xs sm:text-sm`}>Matthew</span>
                      <span className="px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-xs sm:text-sm text-green-400 flex items-center gap-1">John <Check className="w-3 h-3" /></span>
                    </div>
                    <span className="text-purple-400 font-bold text-sm sm:text-base">+100 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Solo Mode */}
            <div className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-300'} backdrop-blur-sm border rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all overflow-hidden`}>
              <div className={`absolute inset-0 ${isDark ? 'bg-blue-500/5' : 'bg-blue-50/50'} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl sm:rounded-3xl`} />

              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Solo Practice</h3>
                <p className={`text-sm sm:text-base mb-4 sm:mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Track your progress and improve your knowledge. The more you play, the faster you quote.</p>

                <div className={`${isDark ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-200'} rounded-xl p-3 sm:p-4 border`}>
                  <p className={`text-xs sm:text-sm mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>PRACTICE MODE</p>
                  <p className={`text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>"The Lord is my <span className="text-blue-500 font-bold">_____</span>, I shall not want."</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                    <span className={`px-2 sm:px-3 py-1 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg text-xs sm:text-sm`}>Guide</span>
                    <span className="px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-xs sm:text-sm text-green-400 flex items-center gap-1">Shepherd <Check className="w-3 h-3" /></span>
                    <span className={`px-2 sm:px-3 py-1 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-lg text-xs sm:text-sm`}>Light</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Battle Categories</h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Challenge opponents in your strongest topic - or your weakest</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {topics.map((topic, idx) => (
              <div
                key={idx}
                className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:border-purple-500/50' : 'bg-white border-gray-200 hover:border-purple-300'} backdrop-blur-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all cursor-pointer overflow-hidden`}
              >
                <div className={`absolute inset-0 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl sm:rounded-2xl`} />
                <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                    <topic.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  </div>
                  <span className={`text-base sm:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{topic.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multiplayer CTA */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                  <Swords className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <span className="text-white text-xs sm:text-sm font-medium">Challenge Mode</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Battle?
                  <br />
                  <span className="text-yellow-300">Prove Your Knowledge.</span>
                </h2>

                <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
                  Challenge your Bible study group, youth group, or family. Connect with a community of learners worldwide.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                  <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-gray-100 transition-all">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                    Start a Battle
                  </Link>
                  <button className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:bg-white/30 transition-all border border-white/30">
                    Enter Room Code
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-shrink-0 hidden md:block">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/30">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1">
                    <Radio className="w-3 h-3 sm:w-4 sm:h-4" /> Live
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-16 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className={`text-lg sm:text-2xl md:text-3xl italic mb-4 sm:mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            "Iron sharpens iron, and one man sharpens another."
          </p>
          <p className={`text-xs sm:text-sm mb-8 sm:mb-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>— Proverbs 27:17</p>

          <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Quote Scripture Confidently
          </h2>

          <Link to="/signup" className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            Start Multiplayer Battle
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} py-8 sm:py-12 px-4 sm:px-6 md:px-12`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-blue-500">Verz</span>
          </div>
          <p className={`text-xs sm:text-sm text-center md:text-right ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Learn the Bible. Quote with confidence. Play with anyone, anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
