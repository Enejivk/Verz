import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Shuffle, ChevronDown, ArrowRight, Sparkles, Flame, Heart, Lightbulb, Star, Gem, Coins, Hand, LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

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

export default function PlaySoloPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(categories[Math.floor(Math.random() * categories.length)]);
  const [showCategories, setShowCategories] = useState(false);

  const randomizeCategory = () => {
    const newCategory = categories[Math.floor(Math.random() * categories.length)];
    setSelectedCategory(newCategory);
  };

  const handleStartSession = () => {
    navigate(`/quiz/solo/${selectedCategory.id}`);
  };

  const SelectedIcon = selectedCategory.Icon;

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

      {/* Back Navigation */}
      <div className="relative z-20 px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/dashboard" className={`inline-flex items-center gap-3 ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-500">Verz</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to <span className="text-blue-500">Quiz</span>?
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Test your Bible knowledge with a quick challenge</p>
          </div>

          {/* Topic Selection Display */}
          <div className="mb-8">
            <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-3xl p-12 text-center`}>
              <div className={`absolute inset-0 ${isDark ? 'bg-blue-500/10' : 'bg-blue-400/10'} rounded-3xl blur-3xl opacity-50`} />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider">Today's Topic</p>
                </div>

                {/* Category Display */}
                <div className="mb-6">
                  <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
                    <SelectedIcon className="w-12 h-12 text-white" />
                  </div>
                  <h2 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedCategory.name}</h2>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Test your knowledge on this topic</p>
                </div>

                {/* Shuffle Button */}
                <button
                  onClick={randomizeCategory}
                  className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'} border rounded-xl transition-all mb-6`}
                >
                  <Shuffle className="w-5 h-5" />
                  <span>Try Another Topic</span>
                </button>

                {/* Start Button */}
                <button
                  onClick={handleStartSession}
                  className="w-full group bg-blue-500 hover:bg-blue-400 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-3"
                >
                  <span>Start Quiz</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="text-center">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className={`inline-flex items-center gap-2 ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'} transition-colors text-sm`}
            >
              <span>or choose a specific topic</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </button>

            {/* Category Grid */}
            {showCategories && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-300">
                {categories.map((category) => {
                  const CategoryIcon = category.Icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategories(false);
                      }}
                      className={`
                        relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm border
                        rounded-xl p-4 hover:border-blue-500/50 transition-all
                        ${selectedCategory.id === category.id ? 'border-blue-500 bg-blue-500/10' : ''}
                      `}
                    >
                      <div className={`w-12 h-12 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <CategoryIcon className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{category.name}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className={`mt-12 relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-2xl p-6`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>How it works</h3>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Answer 5 questions from your chosen topic</li>
                  <li>Identify which book the verse is from</li>
                  <li>Test how well you've memorized Scripture</li>
                  <li>Track your score and improve over time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
