import { Link } from 'react-router-dom';
import { useSession } from 'modelence/client';
import { useQuery } from '@tanstack/react-query';
import { modelenceQuery } from '@modelence/react-query';
import { BookOpen, Compass, Users, Award, Flame, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

type UserStats = {
  rank: number | null;
  score: number;
  gamesPlayed: number;
  winRate: number;
  correctAnswers: number;
  totalAnswers: number;
};

export default function DashboardPage() {
  const { user } = useSession();
  const { isDark } = useTheme();

  const { data: userStats } = useQuery({
    ...modelenceQuery<UserStats>('leaderboard.getMyStats', {}),
  });

  const progress = [
    { label: 'Quizzes Completed', value: userStats?.gamesPlayed ?? 0, icon: Target },
    { label: 'Win Rate', value: `${userStats?.winRate ?? 0}%`, icon: Flame },
    { label: 'Verses Tested', value: userStats?.totalAnswers ?? 0, icon: BookOpen },
  ];

  const insight = {
    text: "The shortest verse in the Bible is John 11:35 — just two words: 'Jesus wept.'",
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a12] text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden relative`} style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* Animated background */}
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

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-500">Verz</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/leaderboard" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors px-4 py-2 flex items-center gap-2`}>
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Community</span>
          </Link>
          <Link to="/profile" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors px-4 py-2`}>
            Profile
          </Link>
          <Link to="/logout" className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} transition-colors px-4 py-2 text-sm`}>
            Logout
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, <span className="text-blue-500">{user?.handle || 'Quiz Master'}</span>
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ready to test your Bible knowledge?</p>
          </div>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {progress.map((item, idx) => (
              <div
                key={idx}
                className={`relative ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Action Buttons */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Personal Study */}
            <Link to="/play/solo">
              <div className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-300'} backdrop-blur-xl border rounded-3xl p-8 transition-all cursor-pointer overflow-hidden`}>
                <div className={`absolute inset-0 ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl`} />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <Compass className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Solo Quiz</h2>
                      <p className="text-blue-500 text-sm font-semibold">Test at Your Pace</p>
                    </div>
                  </div>

                  <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Challenge yourself with Bible trivia. Test how many verses you remember, one question at a time.
                  </p>

                  <div className="flex items-center gap-2 text-blue-500 font-semibold">
                    <span>Start Quiz</span>
                    <Compass className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Topic hint */}
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Choose a topic or get a random challenge</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Group Study */}
            <Link to="/play/multiplayer">
              <div className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-300'} backdrop-blur-xl border rounded-3xl p-8 transition-all cursor-pointer overflow-hidden`}>
                <div className={`absolute inset-0 ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl`} />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Multiplayer Quiz</h2>
                      <p className="text-blue-500 text-sm font-semibold">Compete Together</p>
                    </div>
                  </div>

                  <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create a challenge or join friends. Quiz together in real-time. See who knows Scripture best!
                  </p>

                  <div className="flex items-center gap-2 text-blue-500 font-semibold">
                    <span>Start Challenge</span>
                    <Users className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Session info */}
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center gap-2`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>247 active challenges now</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Insight */}
          <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-3xl p-8`}>
            <div className="absolute top-4 left-6 text-6xl text-blue-500/20 font-serif">"</div>
            <div className="relative z-10 pl-8">
              <p className={`text-xl md:text-2xl italic leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {insight.text}
              </p>
              <p className="text-blue-500 font-medium">Did You Know?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
