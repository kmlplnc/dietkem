import { db } from '../src';
import { consultations, clients } from '../schema';
import { inArray } from 'drizzle-orm';

async function createTomorrowConsultations() {
  try {
    console.log('🚀 Creating consultations for tomorrow...\n');

    // Test client emailleriyle filtrele
    const testEmails = [
      'ayse.yilmaz@test.com',
      'mehmet.demir@test.com',
      'fatma.kaya@test.com',
      'ali.ozkan@test.com',
      'zeynep.arslan@test.com',
      'mustafa.celik@test.com',
      'elif.yildiz@test.com',
      'hasan.koc@test.com',
      'selin.aydin@test.com',
      'emre.sahin@test.com',
    ];

    // Test client id'lerini bul
    const testClients = await db.select().from(clients).where(inArray(clients.email, testEmails));
    const testClientIds = testClients.map(c => c.id);

    if (testClientIds.length === 0) {
      console.log('No test clients found.');
      process.exit(0);
    }

    // Yarının tarihini al
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    console.log(`📅 Creating consultations for: ${tomorrowString}`);

    // Her test danışanı için yarınki randevular oluştur
    const consultationTypes = ['initial', 'follow-up', 'online'];
    const consultationTimes = ['10:00', '14:00', '16:00'];
    
    for (const client of testClients) {
      const clientConsultations = [];
      
      // Her danışan için 1 randevu oluştur
      for (let i = 0; i < 1; i++) {
        const consultationType = consultationTypes[i % consultationTypes.length];
        const consultationTime = consultationTimes[i % consultationTimes.length];
        
        clientConsultations.push({
          client_id: client.id,
          consultation_date: new Date(tomorrowString + 'T' + consultationTime + ':00'),
          consultation_time: consultationTime,
          consultation_type: consultationType,
          notes: `Yarınki ${consultationType === 'initial' ? 'İlk görüşme' : consultationType === 'follow-up' ? 'Kontrol görüşmesi' : 'Online görüşme'} - ${client.name} için test randevusu`,
          status: 'scheduled',
          created_by: 1, // Diyetisyen ID'si
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      
      // Insert consultations for this client
      const insertedConsultations = await db.insert(consultations).values(clientConsultations).returning();
      console.log(`✅ Created ${insertedConsultations.length} consultation for ${client.name} (${tomorrowString} ${consultationTimes[0]})`);
    }

    console.log('\n🎉 Tomorrow consultations created successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${testClients.length} consultations created for tomorrow (${tomorrowString})`);
    console.log(`   - All assigned to dietitian ID: 1`);

  } catch (error) {
    console.error('❌ Error creating tomorrow consultations:', error);
  } finally {
    process.exit(0);
  }
}

createTomorrowConsultations(); 