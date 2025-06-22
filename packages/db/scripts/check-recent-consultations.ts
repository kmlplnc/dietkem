import { db } from '../src';
import { consultations, clients, users } from '../schema';
import { desc, eq } from 'drizzle-orm';

async function checkRecentConsultations() {
  try {
    console.log('🔍 Checking recent consultations...\n');
    
    // Get the last 10 consultations
    const recentConsultations = await db
      .select()
      .from(consultations)
      .orderBy(desc(consultations.created_at))
      .limit(10);

    console.log(`📊 Found ${recentConsultations.length} recent consultations:\n`);
    
    for (const consultation of recentConsultations) {
      // Get client name
      const client = await db
        .select({ name: clients.name })
        .from(clients)
        .where(eq(clients.id, consultation.client_id))
        .limit(1);

      // Get dietitian name
      const dietitian = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, consultation.created_by))
        .limit(1);

      console.log(`📅 Consultation ID: ${consultation.id}`);
      console.log(`   👤 Client: ${client[0]?.name || 'Unknown'} (ID: ${consultation.client_id})`);
      console.log(`   👨‍⚕️ Dietitian: ${dietitian[0]?.name || 'Unknown'} (ID: ${consultation.created_by})`);
      console.log(`   📅 Date: ${consultation.consultation_date}`);
      console.log(`   🕐 Time: ${consultation.consultation_time}`);
      console.log(`   🏥 Type: ${consultation.consultation_type}`);
      console.log(`   📊 Status: ${consultation.status}`);
      console.log(`   📝 Notes: ${consultation.notes || 'No notes'}`);
      console.log(`   ⏰ Created: ${consultation.created_at}`);
      console.log('   ' + '─'.repeat(50));
    }

    // Check for online consultations specifically
    const onlineConsultations = recentConsultations.filter(c => c.consultation_type === 'online');
    console.log(`\n📹 Online consultations found: ${onlineConsultations.length}`);
    
    if (onlineConsultations.length > 0) {
      console.log('\n📹 Online consultations:');
      onlineConsultations.forEach(c => {
        console.log(`   - ID: ${c.id}, Date: ${c.consultation_date}, Status: ${c.status}`);
      });
    }

    // Check for today's consultations
    const today = new Date().toISOString().split('T')[0];
    const todaysConsultations = recentConsultations.filter(c => 
      c.consultation_date.toISOString().split('T')[0] === today
    );
    
    console.log(`\n📅 Today's consultations (${today}): ${todaysConsultations.length}`);
    if (todaysConsultations.length > 0) {
      todaysConsultations.forEach(c => {
        console.log(`   - ID: ${c.id}, Type: ${c.consultation_type}, Status: ${c.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking consultations:', error);
  } finally {
    process.exit(0);
  }
}

checkRecentConsultations(); 