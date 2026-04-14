import { Suspense } from 'react';
import { renderApp, startWebsockets } from 'modelence/client';
import { toast, Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './router';
import favicon from './assets/favicon.svg';
import './index.css';
import LoadingSpinner from './components/LoadingSpinner';
import { useAutoLogin } from './lib/autoLogin';
import multiplayerClientChannel from './channels/multiplayerChannel';
import quizClientChannel from './channels/quizChannel';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

// Initialize WebSocket connection with channels
startWebsockets({
  channels: [multiplayerClientChannel, quizClientChannel],
});

function App() {
  useAutoLogin();

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  );
}

renderApp({
  routesElement: (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  ),
  errorHandler: (error) => {
    toast.error(error.message);
  },
  loadingElement: <LoadingSpinner fullScreen />,
  favicon
});

