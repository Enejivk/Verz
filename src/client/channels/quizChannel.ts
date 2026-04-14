import { ClientChannel } from 'modelence/client';
import type { QuizUpdateMessage } from '@/server/quiz';

// Global state for quiz updates - components can subscribe to this
type QuizUpdateCallback = (message: QuizUpdateMessage) => void;
const subscribers = new Set<QuizUpdateCallback>();

export function subscribeToQuizUpdates(callback: QuizUpdateCallback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

// Global client channel for quiz
const quizClientChannel = new ClientChannel<QuizUpdateMessage>(
  'quiz',
  (message) => {
    console.log('Quiz WebSocket message received:', message);
    // Notify all subscribers
    subscribers.forEach(callback => callback(message));
  }
);

export default quizClientChannel;
