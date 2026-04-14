import { dbUsers } from 'modelence/server';

export async function removeDemoUser() {
  await dbUsers.deleteOne({ handle: 'demo@modelence.dev' });
}
