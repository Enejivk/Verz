import { BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  // Try to use theme, but fall back to dark mode if context not available
  let isDark = true;
  try {
    const theme = useTheme();
    isDark = theme.isDark;
  } catch {
    // Theme context not available, default to dark
  }

  const containerClasses = fullScreen
    ? `h-screen w-screen flex items-center justify-center fixed inset-0 z-50 ${isDark ? 'bg-[#0a0a12]' : 'bg-gray-50'}`
    : `flex items-center justify-center min-h-screen ${isDark ? 'bg-[#0a0a12]' : 'bg-gray-50'}`;

  return (
    <div className={containerClasses} style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      <div className="relative flex flex-col items-center">
        {/* Subtle ambient glow */}
        <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

        {/* Logo with smooth breathing animation */}
        <div className="relative mb-6">
          {/* Progress ring */}
          <svg className="w-20 h-20" viewBox="0 0 80 80">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke={isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.2)'}
              strokeWidth="3"
            />
            {/* Animated arc */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="120 226"
              className="origin-center animate-[spin_1.2s_ease-in-out_infinite]"
              style={{ transformOrigin: '40px 40px' }}
            />
          </svg>

          {/* Centered icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Brand */}
        <span className={`text-xl font-semibold tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>
          VERZ
        </span>

        {/* Optional message */}
        {message && (
          <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
