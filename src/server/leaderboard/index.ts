import { Module, UserInfo, Store, schema, ObjectId } from 'modelence/server';
import { AuthError } from 'modelence';

// Store for player stats (aggregated scores)
const dbPlayerStats = new Store('playerStats', {
  schema: {
    userId: schema.userId(),
    displayName: schema.string(),
    totalScore: schema.number(),
    gamesPlayed: schema.number(),
    correctAnswers: schema.number(),
    totalAnswers: schema.number(),
    updatedAt: schema.date(),
  },
  indexes: [
    { key: { userId: 1 }, unique: true },
    { key: { totalScore: -1 } },
  ]
});

export default new Module('leaderboard', {
  stores: [dbPlayerStats],

  queries: {
    // Get top players for leaderboard
    getLeaderboard: async (_args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const topPlayers = await dbPlayerStats.fetch(
        {},
        { sort: { totalScore: -1 }, limit: 50 }
      );

      return topPlayers.map((player, index) => ({
        rank: index + 1,
        name: player.displayName,
        score: player.totalScore,
        gamesPlayed: player.gamesPlayed,
        winRate: player.totalAnswers > 0
          ? Math.round((player.correctAnswers / player.totalAnswers) * 100)
          : 0,
      }));
    },

    // Get current user's rank and stats
    getMyStats: async (_args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const myStats = await dbPlayerStats.findOne({ userId: new ObjectId(user.id) });

      if (!myStats) {
        return {
          rank: null,
          score: 0,
          gamesPlayed: 0,
          winRate: 0,
          correctAnswers: 0,
          totalAnswers: 0,
        };
      }

      // Calculate rank by counting players with higher scores
      const higherScoreCount = await dbPlayerStats.countDocuments({
        totalScore: { $gt: myStats.totalScore }
      });

      return {
        rank: higherScoreCount + 1,
        score: myStats.totalScore,
        gamesPlayed: myStats.gamesPlayed,
        winRate: myStats.totalAnswers > 0
          ? Math.round((myStats.correctAnswers / myStats.totalAnswers) * 100)
          : 0,
        correctAnswers: myStats.correctAnswers,
        totalAnswers: myStats.totalAnswers,
      };
    },
  },

  mutations: {
    // Update player stats after a game (called after quiz completion)
    recordGameResult: async (args: unknown, { user }: { user: UserInfo | null }) => {
      if (!user) throw new AuthError('Not authenticated');

      const { score, correctAnswers, totalAnswers } = args as {
        score: number;
        correctAnswers: number;
        totalAnswers: number;
      };

      const existingStats = await dbPlayerStats.findOne({ userId: new ObjectId(user.id) });

      if (existingStats) {
        await dbPlayerStats.updateOne(
          { userId: new ObjectId(user.id) },
          {
            $inc: {
              totalScore: score,
              gamesPlayed: 1,
              correctAnswers: correctAnswers,
              totalAnswers: totalAnswers,
            },
            $set: {
              displayName: user.handle || 'Player',
              updatedAt: new Date(),
            }
          }
        );
      } else {
        await dbPlayerStats.insertOne({
          userId: new ObjectId(user.id),
          displayName: user.handle || 'Player',
          totalScore: score,
          gamesPlayed: 1,
          correctAnswers: correctAnswers,
          totalAnswers: totalAnswers,
          updatedAt: new Date(),
        });
      }

      return { success: true };
    },
  },
});
