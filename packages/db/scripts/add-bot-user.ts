import { db } from '../src';
import { users } from '../src/schema';
import { randomUUID } from 'crypto';

async function addBotUser({
  email,
  role = 'subscriber_basic',
  first_name = 'Bot',
  last_name = 'User',
  username = ''
}: {
  email: string;
  role?: typeof users.$inferInsert.role;
  first_name?: string;
  last_name?: string;
  username?: string;
}) {
  const clerk_id = 'bot_' + randomUUID();
  const now = new Date();
  const [user] = await db.insert(users).values({
    clerk_id,
    email,
    role,
    first_name,
    last_name,
    username,
    created_at: now,
    updated_at: now,
  }).returning();
  console.log('Bot user created:', user);
}

async function main() {
  await addBotUser({
    email: 'bot1@example.com',
    role: 'subscriber_basic',
    first_name: 'Bot',
    last_name: 'Basic',
    username: 'botbasic'
  });
  await addBotUser({
    email: 'bot2@example.com',
    role: 'clinic_admin',
    first_name: 'Bot',
    last_name: 'Clinic',
    username: 'botclinic'
  });
  await addBotUser({
    email: 'bot3@example.com',
    role: 'dietitian_team_member',
    first_name: 'Bot',
    last_name: 'Dietitian',
    username: 'botdietitian'
  });
  await addBotUser({
    email: 'bot4@example.com',
    role: 'admin',
    first_name: 'Bot',
    last_name: 'Admin',
    username: 'botadmin'
  });
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); 