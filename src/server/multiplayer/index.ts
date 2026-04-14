import { Module, ServerChannel, UserInfo, Store, schema } from 'modelence/server';
import { AuthError } from 'modelence';
import z from 'zod';

// TypeScript types for WebSocket messages
export type Player = {
  odPlayerId: string;
  odPlayerName: string;
  odIsHost: boolean;
  odIsReady: boolean;
  odJoinedAt: Date;
};

export type MultiplayerSession = {
  id?: string;
  sessionCode: string;
  hostId: string;
  hostName: string;
  players: Player[];
  category: string | null;
  questionCount: number;
  status: 'waiting' | 'starting' | 'active' | 'finished';
  createdAt: Date;
  updatedAt: Date;
};

export type SessionUpdateMessage = {
  type: 'player_joined' | 'player_left' | 'category_selected' | 'question_count_changed' | 'game_starting' | 'session_updated' | 'session_closed';
  session?: MultiplayerSession;
  odPlayerId?: string;
  odPlayerName?: string;
  category?: string;
  questionCount?: number;
  message?: string;
};

// MongoDB Store for persistent sessions
const dbSessions = new Store('multiplayerSessions', {
  schema: {
    sessionCode: schema.string(),
    hostId: schema.string(),
    hostName: schema.string(),
    players: schema.array(schema.object({
      odPlayerId: schema.string(),
      odPlayerName: schema.string(),
      odIsHost: schema.boolean(),
      odIsReady: schema.boolean(),
      odJoinedAt: schema.date(),
    })),
    category: schema.string().nullable(),
    questionCount: schema.number(),
    status: schema.string(),
    createdAt: schema.date(),
    updatedAt: schema.date(),
  },
  indexes: [
    { key: { sessionCode: 1 }, unique: true },
    { key: { status: 1 } },
    { key: { updatedAt: 1 }, expireAfterSeconds: 3600 }, // Auto-delete after 1 hour of inactivity
  ]
});

// Server channel for multiplayer sessions
const multiplayerChannel = new ServerChannel<SessionUpdateMessage>(
  'multiplayer',
  async ({ user }) => {
    // Only authenticated users can access multiplayer
    return !!user;
  }
);

// Helper function to convert DB document to session object
function toSession(doc: any): MultiplayerSession {
  return {
    id: doc._id?.toString(),
    sessionCode: doc.sessionCode,
    hostId: doc.hostId,
    hostName: doc.hostName,
    players: doc.players.map((p: any) => ({
      odPlayerId: p.odPlayerId,
      odPlayerName: p.odPlayerName,
      odIsHost: p.odIsHost,
      odIsReady: p.odIsReady,
      odJoinedAt: p.odJoinedAt,
    })),
    category: doc.category,
    questionCount: doc.questionCount || 5, // Default to 5 for backwards compatibility
    status: doc.status as MultiplayerSession['status'],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default new Module('multiplayer', {
  stores: [dbSessions],
  channels: [multiplayerChannel],

  queries: {
    // Get session by code - does NOT modify anything
    getSession: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const session = await dbSessions.findOne({ sessionCode: code });

      if (!session) {
        return null; // Return null instead of throwing - let client handle
      }

      // Update the updatedAt to keep session alive
      await dbSessions.updateOne(
        { sessionCode: code },
        { $set: { updatedAt: new Date() } }
      );

      return toSession(session);
    },

    // Check if user is in a session
    getMySession: async (_args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      // Find any session where this user is a player
      const session = await dbSessions.findOne({
        'players.odPlayerId': user.id,
        status: { $in: ['waiting', 'starting', 'active'] }
      });

      if (!session) {
        return null;
      }

      return toSession(session);
    },

    // List active sessions (for browsing)
    listActiveSessions: async (_args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const sessions = await dbSessions.fetch(
        { status: 'waiting' },
        { limit: 50, sort: { createdAt: -1 } }
      );

      return {
        sessions: sessions.map(toSession),
        total: sessions.length,
      };
    },
  },

  mutations: {
    // Create a new session
    createSession: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      // Check if session already exists
      const existing = await dbSessions.findOne({ sessionCode: code });
      if (existing) {
        // If user is already host, return existing session
        if (existing.hostId === user.id) {
          return toSession(existing);
        }
        throw new Error('Session code already in use. Please try a different code.');
      }

      // Check if user is already in another active session
      const userSession = await dbSessions.findOne({
        'players.odPlayerId': user.id,
        status: { $in: ['waiting', 'starting'] }
      });

      if (userSession && userSession.sessionCode !== code) {
        // Remove user from old session first
        await dbSessions.updateOne(
          { _id: userSession._id },
          {
            $pull: { players: { odPlayerId: user.id } },
            $set: { updatedAt: new Date() }
          }
        );
      }

      const now = new Date();
      const newSession = {
        sessionCode: code,
        hostId: user.id,
        hostName: user.handle,
        players: [{
          odPlayerId: user.id,
          odPlayerName: user.handle,
          odIsHost: true,
          odIsReady: true, // Host is always ready
          odJoinedAt: now,
        }],
        category: null,
        questionCount: 5, // Default to 5 questions
        status: 'waiting',
        createdAt: now,
        updatedAt: now,
      };

      await dbSessions.insertOne(newSession);

      const created = await dbSessions.findOne({ sessionCode: code });
      return toSession(created!);
    },

    // Join an existing session
    joinSession: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const session = await dbSessions.findOne({ sessionCode: code });

      if (!session) {
        throw new Error('Session not found. Please check the code and try again.');
      }

      if (session.status !== 'waiting') {
        throw new Error('This session has already started. You cannot join now.');
      }

      // Check if player already in this session
      const existingPlayer = session.players.find((p: any) => p.odPlayerId === user.id);
      if (existingPlayer) {
        // Already in session, just return it
        return toSession(session);
      }

      // Check if user is in another session and remove them
      const otherSession = await dbSessions.findOne({
        'players.odPlayerId': user.id,
        sessionCode: { $ne: code },
        status: { $in: ['waiting', 'starting'] }
      });

      if (otherSession) {
        await dbSessions.updateOne(
          { _id: otherSession._id },
          {
            $pull: { players: { odPlayerId: user.id } },
            $set: { updatedAt: new Date() }
          }
        );

        // Broadcast to old session
        multiplayerChannel.broadcast(otherSession.sessionCode, {
          type: 'player_left',
          odPlayerId: user.id,
          odPlayerName: user.handle,
        });
      }

      // Add player to session
      const newPlayer = {
        odPlayerId: user.id,
        odPlayerName: user.handle,
        odIsHost: false,
        odIsReady: false,
        odJoinedAt: new Date(),
      };

      await dbSessions.updateOne(
        { sessionCode: code },
        {
          $push: { players: newPlayer },
          $set: { updatedAt: new Date() }
        }
      );

      const updatedSession = await dbSessions.findOne({ sessionCode: code });
      const sessionObj = toSession(updatedSession!);

      // Broadcast to all players in this session
      console.log('[Multiplayer] Broadcasting player_joined to channel:', code, 'players:', sessionObj.players.length);
      multiplayerChannel.broadcast(code, {
        type: 'player_joined',
        session: sessionObj,
        odPlayerId: user.id,
        odPlayerName: user.handle,
      });

      return sessionObj;
    },

    // Leave a session
    leaveSession: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const session = await dbSessions.findOne({ sessionCode: code });

      if (!session) {
        return { success: true, sessionDeleted: false };
      }

      // Check if user is in this session
      const playerIndex = session.players.findIndex((p: any) => p.odPlayerId === user.id);
      if (playerIndex === -1) {
        return { success: true, sessionDeleted: false };
      }

      const isHost = session.hostId === user.id;
      const remainingPlayers = session.players.filter((p: any) => p.odPlayerId !== user.id);

      if (remainingPlayers.length === 0) {
        // No players left, delete session
        await dbSessions.deleteOne({ sessionCode: code });

        multiplayerChannel.broadcast(code, {
          type: 'session_closed',
          message: 'Session has been closed',
        });

        return { success: true, sessionDeleted: true };
      }

      if (isHost) {
        // Assign new host
        const newHost = remainingPlayers[0];
        newHost.odIsHost = true;

        await dbSessions.updateOne(
          { sessionCode: code },
          {
            $set: {
              hostId: newHost.odPlayerId,
              hostName: newHost.odPlayerName,
              players: remainingPlayers,
              updatedAt: new Date()
            }
          }
        );
      } else {
        await dbSessions.updateOne(
          { sessionCode: code },
          {
            $pull: { players: { odPlayerId: user.id } },
            $set: { updatedAt: new Date() }
          }
        );
      }

      const updatedSession = await dbSessions.findOne({ sessionCode: code });

      if (updatedSession) {
        multiplayerChannel.broadcast(code, {
          type: 'player_left',
          session: toSession(updatedSession),
          odPlayerId: user.id,
          odPlayerName: user.handle,
        });
      }

      return { success: true, sessionDeleted: false };
    },

    // Select category (host only)
    selectCategory: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode, category } = z.object({
        sessionCode: z.string(),
        category: z.string(),
      }).parse(args);

      const code = sessionCode.toUpperCase().trim();
      const session = await dbSessions.findOne({ sessionCode: code });

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.hostId !== user.id) {
        throw new Error('Only the host can select the category');
      }

      await dbSessions.updateOne(
        { sessionCode: code },
        { $set: { category, updatedAt: new Date() } }
      );

      const updatedSession = await dbSessions.findOne({ sessionCode: code });
      const sessionObj = toSession(updatedSession!);

      console.log('[Multiplayer] Broadcasting category_selected to channel:', code, 'category:', category);
      multiplayerChannel.broadcast(code, {
        type: 'category_selected',
        session: sessionObj,
        category,
      });

      return sessionObj;
    },

    // Set question count (host only)
    setQuestionCount: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode, questionCount } = z.object({
        sessionCode: z.string(),
        questionCount: z.number().min(5).max(20),
      }).parse(args);

      const code = sessionCode.toUpperCase().trim();
      const session = await dbSessions.findOne({ sessionCode: code });

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.hostId !== user.id) {
        throw new Error('Only the host can change the question count');
      }

      await dbSessions.updateOne(
        { sessionCode: code },
        { $set: { questionCount, updatedAt: new Date() } }
      );

      const updatedSession = await dbSessions.findOne({ sessionCode: code });
      const sessionObj = toSession(updatedSession!);

      console.log('[Multiplayer] Broadcasting question_count_changed to channel:', code, 'count:', questionCount);
      multiplayerChannel.broadcast(code, {
        type: 'question_count_changed',
        session: sessionObj,
        questionCount,
      });

      return sessionObj;
    },

    // Toggle ready status
    toggleReady: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const session = await dbSessions.findOne({ sessionCode: code });

      if (!session) {
        throw new Error('Session not found');
      }

      const playerIndex = session.players.findIndex((p: any) => p.odPlayerId === user.id);
      if (playerIndex === -1) {
        throw new Error('You are not in this session');
      }

      // Toggle ready status
      const newReadyStatus = !session.players[playerIndex].odIsReady;

      await dbSessions.updateOne(
        { sessionCode: code, 'players.odPlayerId': user.id },
        {
          $set: {
            'players.$.odIsReady': newReadyStatus,
            updatedAt: new Date()
          }
        }
      );

      const updatedSession = await dbSessions.findOne({ sessionCode: code });
      const sessionObj = toSession(updatedSession!);

      console.log('[Multiplayer] Broadcasting session_updated (toggleReady) to channel:', code);
      multiplayerChannel.broadcast(code, {
        type: 'session_updated',
        session: sessionObj,
      });

      return sessionObj;
    },

    // Start game (host only)
    startGame: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) {
        throw new AuthError('Not authenticated');
      }

      const { sessionCode } = z.object({ sessionCode: z.string() }).parse(args);
      const code = sessionCode.toUpperCase().trim();

      const session = await dbSessions.findOne({ sessionCode: code });

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.hostId !== user.id) {
        throw new Error('Only the host can start the game');
      }

      if (!session.category) {
        throw new Error('Please select a category first');
      }

      if (session.players.length < 1) {
        throw new Error('Need at least 1 player to start');
      }

      await dbSessions.updateOne(
        { sessionCode: code },
        { $set: { status: 'starting', updatedAt: new Date() } }
      );

      const updatedSession = await dbSessions.findOne({ sessionCode: code });
      const sessionObj = toSession(updatedSession!);

      multiplayerChannel.broadcast(code, {
        type: 'game_starting',
        session: sessionObj,
      });

      return sessionObj;
    },
  },
});
