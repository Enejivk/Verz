import { startApp } from 'modelence/server';
import exampleModule from '@/server/example';
import multiplayerModule from '@/server/multiplayer';
import quizModule from '@/server/quiz';
import leaderboardModule from '@/server/leaderboard';
import { createDemoUser } from '@/server/migrations/createDemoUser';
import { removeDemoUser } from '@/server/migrations/removeDemoUser';

startApp({
  modules: [exampleModule, multiplayerModule, quizModule, leaderboardModule],

  security: {
    frameAncestors: ['https://modelence.com', 'https://*.modelence.com', 'http://localhost:*'],
  },

  migrations: [{
    version: 1,
    description: 'Create demo user',
    handler: createDemoUser,
  }, {
    version: 2,
    description: 'Remove demo user',
    handler: removeDemoUser,
  }],
});
