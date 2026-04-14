import React, { useCallback, useEffect } from 'react';
import { getConfig, loginWithPassword, useSession } from 'modelence/client';
import { Button } from '@/client/components/ui/Button';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Mail, Lock, ArrowRight, Sparkles, Users, Award, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const { isDark } = useTheme();
  const { user } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSandboxEnv = getConfig('_system.env.type') === 'sandbox';
  const defaultDemoEmail = isSandboxEnv ? getConfig('example.modelenceDemoUsername') as string | undefined : undefined;
  const defaultDemoPassword = isSandboxEnv ? getConfig('example.modelenceDemoPassword') as string | undefined : undefined;

  // Redirect to dashboard if user is already logged in (e.g., after Google OAuth)
  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get('_redirect');
      navigate(redirectTo ? decodeURIComponent(redirectTo) : '/dashboard', { replace: true });
    }
  }, [user, navigate, searchParams]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await loginWithPassword({ email, password });

    // Redirect to dashboard or the original destination
    const redirectTo = searchParams.get('_redirect');
    navigate(redirectTo ? decodeURIComponent(redirectTo) : '/dashboard');
  }, [navigate, searchParams]);

  const handleGoogleSignIn = () => {
    const redirectTo = searchParams.get('_redirect') || '/dashboard';
    window.location.href = `/api/_internal/auth/google?_redirect=${encodeURIComponent(redirectTo)}`;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a12] text-white' : 'bg-gray-50 text-gray-900'} flex justify-center`} style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-7xl flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className={`absolute top-0 left-0 w-full h-full ${isDark ? 'bg-[#0a0a12]' : 'bg-gray-50'}`} />
          <div className={`absolute top-1/4 -left-20 w-80 h-80 ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/20'} rounded-full blur-[100px] animate-pulse`} />
          <div className={`absolute bottom-1/4 right-0 w-96 h-96 ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/15'} rounded-full blur-[120px] animate-pulse`} style={{ animationDelay: '1s' }} />

          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          <div className="absolute bottom-48 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '3.5s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-3 w-fit">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-500">Verz</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Hero Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
                Continue Your
                <span className="block text-blue-500">
                  Quiz Challenge
                </span>
              </h1>
              <p className={`text-xl max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Pick up where you left off. Your quiz streak awaits.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className={`flex items-center gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-4 hover:bg-white/10 transition-all`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl flex items-center justify-center`}>
                  <Compass className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Solo Quizzes</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Test yourself at your pace</p>
                </div>
              </div>

              <div className={`flex items-center gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-4 hover:bg-white/10 transition-all`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Multiplayer Challenges</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Compete with friends</p>
                </div>
              </div>

              <div className={`flex items-center gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-4 hover:bg-white/10 transition-all`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl flex items-center justify-center`}>
                  <Award className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Track Your Score</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>See your progress & rank</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Scripture */}
          <div className={`${isDark ? 'bg-white/5' : 'bg-white'} border-l-2 border-blue-500 pl-6 py-4`}>
            <p className={`italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>"Your word is a lamp to my feet and a light to my path."</p>
            <p className="text-blue-500 text-sm mt-2">Psalm 119:105</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 -left-32 w-96 h-96 ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/20'} rounded-full blur-[120px]`} />
          <div className={`absolute bottom-1/4 -right-32 w-96 h-96 ${isDark ? 'bg-blue-600/15' : 'bg-blue-400/15'} rounded-full blur-[120px]`} />
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden relative z-20 px-6 py-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-500">Verz</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-100 border-blue-200'} border rounded-full px-4 py-2 mb-6`}>
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Welcome back</span>
              </div>
              <h1 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign in to Verz</h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Continue testing your Bible knowledge</p>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className={`w-full mb-6 flex items-center justify-center gap-3 ${isDark ? 'bg-white/10 hover:bg-white/15 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'} border px-6 py-4 rounded-2xl font-semibold transition-all`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>or sign in with email</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email address
                </Label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`} />
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={defaultDemoEmail}
                    className={`w-full pl-12 pr-4 py-4 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white/10' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:bg-white'} border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </Label>
                  <button type="button" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`} />
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    defaultValue={defaultDemoPassword}
                    className={`w-full pl-12 pr-4 py-4 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white/10' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:bg-white'} border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-400 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group"
                type="submit"
              >
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
                >
                  Start quizzing
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className={`mt-10 flex items-center justify-center gap-6 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
