import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { modelenceQuery } from '@modelence/react-query';
import { BookOpen, Award, Medal, Crown, User, ArrowLeft, Flame, TrendingUp, Loader2, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  gamesPlayed: number;
  winRate: number;
};

type MyStats = {
  rank: number | null;
  score: number;
  gamesPlayed: number;
  winRate: number;
};

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
  return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>;
}

function getRankBg(rank: number) {
  if (rank === 1) return 'bg-yellow-500/20 border-yellow-500/30';
  if (rank === 2) return 'bg-gray-400/20 border-gray-400/30';
  if (rank === 3) return 'bg-amber-600/20 border-amber-600/30';
  return 'bg-white/5 border-white/10';
}

export default function LeaderboardPage() {
  const { isDark } = useTheme();

  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useQuery({
    ...modelenceQuery<LeaderboardEntry[]>('leaderboard.getLeaderboard', {}),
  });

  const { data: myStats, isLoading: isLoadingMyStats } = useQuery({
    ...modelenceQuery<MyStats>('leaderboard.getMyStats', {}),
  });

  const isLoading = isLoadingLeaderboard || isLoadingMyStats;
  const hasData = leaderboard && leaderboard.length > 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a12] text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden relative`} style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-32 w-96 h-96 ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/20'} rounded-full blur-[120px] animate-pulse`} />
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/15'} rounded-full blur-[120px] animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'} rounded-full blur-[150px]`} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-20 px-6 md:px-12 py-6">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className={`inline-flex items-center gap-3 ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-500">Verz</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/dashboard" className={`inline-flex items-center gap-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Award className="w-10 h-10 text-blue-400" />
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-blue-400">Community</span>
              </h1>
            </div>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>See how the community is growing together</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading community progress...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !hasData && (
            <div className="text-center py-20">
              <div className={`w-24 h-24 ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Award className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No Progress Yet</h2>
              <p className={`mb-8 max-w-md mx-auto ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Be among the first to test your Bible knowledge!
              </p>
              <Link
                to="/play/solo"
                className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all"
              >
                <Compass className="w-6 h-6" />
                <span>Start Quiz</span>
              </Link>
            </div>
          )}

          {/* Leaderboard Content */}
          {!isLoading && hasData && (
            <>
              {/* Your Progress Card */}
              {myStats && (
                <div className="relative bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-8">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl opacity-50" />
                  <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your Progress</p>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {myStats.rank ? `#${myStats.rank}` : 'Just Starting'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Score</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {myStats.score.toLocaleString()}
                      </p>
                    </div>
                    {myStats.gamesPlayed > 0 && (
                      <div className={`hidden sm:flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm">{myStats.gamesPlayed} quizzes completed</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Top 3 Highlight */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* Second Place */}
                  <div className={`relative ${isDark ? 'bg-white/5 border-gray-400/20' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6 text-center mt-8`}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Medal className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className={`w-16 h-16 ${isDark ? 'bg-gray-500' : 'bg-gray-400'} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white`}>
                      2
                    </div>
                    <p className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{leaderboard[1].name}</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem' }}>{leaderboard[1].score.toLocaleString()} points</p>
                  </div>

                  {/* First Place */}
                  <div className="relative bg-yellow-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 text-center">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <Crown className="w-12 h-12 text-yellow-400" />
                    </div>
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold shadow-lg shadow-yellow-500/30 text-black">
                      1
                    </div>
                    <p className={`font-bold text-xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{leaderboard[0].name}</p>
                    <p className="text-yellow-400 text-lg font-semibold">{leaderboard[0].score.toLocaleString()} points</p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-blue-400">
                      <Flame className="w-4 h-4" />
                      <span className="text-xs">{leaderboard[0].gamesPlayed} quizzes</span>
                    </div>
                  </div>

                  {/* Third Place */}
                  <div className={`relative ${isDark ? 'bg-white/5 border-amber-600/20' : 'bg-white border-amber-200'} backdrop-blur-xl border rounded-2xl p-6 text-center mt-8`}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Medal className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
                      3
                    </div>
                    <p className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{leaderboard[2].name}</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem' }}>{leaderboard[2].score.toLocaleString()} points</p>
                  </div>
                </div>
              )}

              {/* Full Progress List */}
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Leaderboard</h2>
                </div>
                <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                  {leaderboard.map((learner) => (
                    <div
                      key={learner.rank}
                      className={`px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${getRankBg(learner.rank)} border-l-2`}
                    >
                      <div className="w-8 flex justify-center">
                        {getRankIcon(learner.rank)}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{learner.name}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{learner.gamesPlayed} quizzes completed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-blue-400">
                          {learner.score.toLocaleString()}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 text-center">
                <Link
                  to="/play/solo"
                  className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all"
                >
                  <Compass className="w-6 h-6" />
                  <span>Take Another Quiz</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
