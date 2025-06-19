import { db } from '../src';
import { users } from '../src/schema';

async function setAdminRole(clerk_id: string, role: 'admin' | 'superadmin') {
  const [user] = await db.update(users)
    .set({ role })
    .where(users.clerk_id.eq(clerk_id))
    .returning();
  if (user) {
    console.log(`Kullanıcıya '${role}' rolü atandı:`, user);
  } else {
    console.log('Kullanıcı bulunamadı!');
  }
}

const clerkId = process.argv[2];
const role = (process.argv[3] as 'admin' | 'superadmin') || 'superadmin';

if (!clerkId) {
  console.error('Kullanıcı clerk_id parametresi gerekli!');
  process.exit(1);
}

setAdminRole(clerkId, role).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); 