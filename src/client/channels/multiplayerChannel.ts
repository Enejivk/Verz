import { ClientChannel } from 'modelence/client';
import type { SessionUpdateMessage } from '@/server/multiplayer';

// Global state for session updates - components can subscribe to this
type SessionUpdateCallback = (message: SessionUpdateMessage) => void;
const subscribers = new Set<SessionUpdateCallback>();

export function subscribeToSessionUpdates(callback: SessionUpdateCallback) {
  console.log('[MultiplayerChannel] New subscriber added, total:', subscribers.size + 1);
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
    console.log('[MultiplayerChannel] Subscriber removed, total:', subscribers.size);
  };
}

// Global client channel for multiplayer
const multiplayerClientChannel = new ClientChannel<SessionUpdateMessage>(
  'multiplayer',
  async (message) => {
    console.log('[MultiplayerChannel] WebSocket message received:', message.type, message);
    console.log('[MultiplayerChannel] Notifying', subscribers.size, 'subscribers');
    // Notify all subscribers
    subscribers.forEach(callback => {
      try {
        callback(message);
      } catch (err) {
        console.error('[MultiplayerChannel] Error in subscriber callback:', err);
      }
    });
  }
);

export default multiplayerClientChannel;
