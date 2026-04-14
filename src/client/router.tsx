import { lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouteObject, useLocation, useSearchParams } from 'react-router-dom';
import { useSession } from 'modelence/client';

// For guest-only routes (login, signup) - redirects to dashboard if already logged in
function GuestRoute() {
  const { user } = useSession();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const encodedRedirect = searchParams.get('_redirect');
  const redirect = encodedRedirect ? decodeURIComponent(encodedRedirect) : '/dashboard';

  if (user) {
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// For protected routes - redirects to login if not authenticated
function PrivateRoute() {
  const { user } = useSession();
  const location = useLocation();

  if (!user) {
    const fullPath = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?_redirect=${encodeURIComponent(fullPath)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

// Public routes (no auth required)
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    Component: lazy(() => import('./pages/LandingV3'))
  },
  {
    path: '/example/:itemId',
    Component: lazy(() => import('./pages/ExamplePage'))
  },
  {
    path: '/terms',
    Component: lazy(() => import('./pages/TermsPage'))
  },
  {
    path: '/logout',
    Component: lazy(() => import('./pages/LogoutPage'))
  },
  {
    path: '*',
    Component: lazy(() => import('./pages/NotFoundPage'))
  }
];

// Guest routes (redirect to home if already logged in)
const guestRoutes: RouteObject[] = [
  {
    path: '/login',
    Component: lazy(() => import('./pages/LoginPage'))
  },
  {
    path: '/signup',
    Component: lazy(() => import('./pages/SignupPage'))
  }
];

// Private routes (redirect to login if not authenticated)
const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    Component: lazy(() => import('./pages/DashboardPage'))
  },
  {
    path: '/play/solo',
    Component: lazy(() => import('./pages/PlaySoloPage'))
  },
  {
    path: '/play/multiplayer',
    Component: lazy(() => import('./pages/MultiplayerPage'))
  },
  {
    path: '/multiplayer/session/:sessionCode',
    Component: lazy(() => import('./pages/MultiplayerLobbyPage'))
  },
  {
    path: '/quiz/multiplayer/:sessionCode',
    Component: lazy(() => import('./pages/MultiplayerQuizPage'))
  },
  {
    path: '/quiz/solo/:category',
    Component: lazy(() => import('./pages/SoloQuizPage'))
  },
  {
    path: '/leaderboard',
    Component: lazy(() => import('./pages/LeaderboardPage'))
  },
  {
    path: '/example/private',
    Component: lazy(() => import('./pages/PrivateExamplePage'))
  }
];

export const router = createBrowserRouter([
  ...publicRoutes,
  {
    Component: GuestRoute,
    children: guestRoutes
  },
  {
    Component: PrivateRoute,
    children: privateRoutes
  }
]);
