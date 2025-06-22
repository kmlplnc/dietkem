import { db } from '../src';
import { clients, consultations } from '../schema';
import { users } from '../schema';

async function createTestClientsAndConsultations() {
  try {
    console.log('🚀 Creating test clients and consultations...\n');

    // Get the first user (dietitian) to assign clients to
    const dietitians = await db.select().from(users).limit(1);
    
    if (dietitians.length === 0) {
      console.error('❌ No users found in the database. Please create a user first.');
      return;
    }

    const dietitianId = dietitians[0].id;
    console.log(`👨‍⚕️ Using dietitian ID: ${dietitianId} (${dietitians[0].first_name} ${dietitians[0].last_name})`);

    // Test client data
    const testClients = [
      {
        name: 'Ayşe Yılmaz',
        gender: 'Kadın',
        birth_date: new Date('1990-05-15'),
        height_cm: 165.5,
        email: 'ayse.yilmaz@test.com',
        phone: '0532 123 4567',
        notes: 'Test danışanı - Kilo verme hedefi',
        client_notes: 'Haftalık kontroller yapılacak',
        diseases: JSON.stringify(['Hipertansiyon']),
        allergies: JSON.stringify(['Fındık']),
        medications: JSON.stringify(['Tansiyon ilacı']),
        activity_level: 'Orta',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Mehmet Demir',
        gender: 'Erkek',
        birth_date: new Date('1985-08-22'),
        height_cm: 178.0,
        email: 'mehmet.demir@test.com',
        phone: '0533 234 5678',
        notes: 'Test danışanı - Kas kazanma hedefi',
        client_notes: 'Protein ağırlıklı beslenme',
        diseases: JSON.stringify([]),
        allergies: JSON.stringify([]),
        medications: JSON.stringify([]),
        activity_level: 'Yüksek',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Fatma Kaya',
        gender: 'Kadın',
        birth_date: new Date('1992-03-10'),
        height_cm: 160.0,
        email: 'fatma.kaya@test.com',
        phone: '0534 345 6789',
        notes: 'Test danışanı - Sağlıklı beslenme',
        client_notes: 'Dengeli beslenme planı',
        diseases: JSON.stringify(['Diyabet']),
        allergies: JSON.stringify(['Gluten']),
        medications: JSON.stringify(['Diyabet ilacı']),
        activity_level: 'Düşük',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Ali Özkan',
        gender: 'Erkek',
        birth_date: new Date('1988-11-05'),
        height_cm: 182.5,
        email: 'ali.ozkan@test.com',
        phone: '0535 456 7890',
        notes: 'Test danışanı - Sporcu beslenmesi',
        client_notes: 'Performans odaklı beslenme',
        diseases: JSON.stringify([]),
        allergies: JSON.stringify(['Süt']),
        medications: JSON.stringify([]),
        activity_level: 'Yüksek',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Zeynep Arslan',
        gender: 'Kadın',
        birth_date: new Date('1995-07-18'),
        height_cm: 168.0,
        email: 'zeynep.arslan@test.com',
        phone: '0536 567 8901',
        notes: 'Test danışanı - Hamilelik beslenmesi',
        client_notes: 'Hamilelik dönemi beslenme planı',
        diseases: JSON.stringify([]),
        allergies: JSON.stringify([]),
        medications: JSON.stringify(['Vitamin takviyesi']),
        activity_level: 'Orta',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Mustafa Çelik',
        gender: 'Erkek',
        birth_date: new Date('1983-12-25'),
        height_cm: 175.0,
        email: 'mustafa.celik@test.com',
        phone: '0537 678 9012',
        notes: 'Test danışanı - Kolesterol kontrolü',
        client_notes: 'Düşük kolesterol diyeti',
        diseases: JSON.stringify(['Yüksek Kolesterol']),
        allergies: JSON.stringify([]),
        medications: JSON.stringify(['Kolesterol ilacı']),
        activity_level: 'Orta',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Elif Yıldız',
        gender: 'Kadın',
        birth_date: new Date('1991-04-30'),
        height_cm: 162.5,
        email: 'elif.yildiz@test.com',
        phone: '0538 789 0123',
        notes: 'Test danışanı - Vejetaryen beslenme',
        client_notes: 'Vejetaryen beslenme planı',
        diseases: JSON.stringify([]),
        allergies: JSON.stringify([]),
        medications: JSON.stringify([]),
        activity_level: 'Düşük',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Hasan Koç',
        gender: 'Erkek',
        birth_date: new Date('1987-09-14'),
        height_cm: 180.0,
        email: 'hasan.koc@test.com',
        phone: '0539 890 1234',
        notes: 'Test danışanı - Kilo alma hedefi',
        client_notes: 'Sağlıklı kilo alma planı',
        diseases: JSON.stringify([]),
        allergies: JSON.stringify(['Yumurta']),
        medications: JSON.stringify([]),
        activity_level: 'Orta',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Selin Aydın',
        gender: 'Kadın',
        birth_date: new Date('1993-01-20'),
        height_cm: 166.0,
        email: 'selin.aydin@test.com',
        phone: '0530 901 2345',
        notes: 'Test danışanı - Detoks programı',
        client_notes: 'Detoks ve temizlik programı',
        diseases: JSON.stringify([]),
        allergies: JSON.stringify([]),
        medications: JSON.stringify([]),
        activity_level: 'Düşük',
        status: 'active',
        user_id: dietitianId
      },
      {
        name: 'Emre Şahin',
        gender: 'Erkek',
        birth_date: new Date('1986-06-08'),
        height_cm: 177.5,
        email: 'emre.sahin@test.com',
        phone: '0531 012 3456',
        notes: 'Test danışanı - Anti-aging beslenme',
        client_notes: 'Anti-aging beslenme programı',
        diseases: JSON.stringify([]),
        allergies: JSON.stringify([]),
        medications: JSON.stringify(['Vitamin D']),
        activity_level: 'Yüksek',
        status: 'active',
        user_id: dietitianId
      }
    ];

    // Insert test clients
    console.log('📝 Inserting test clients...');
    const insertedClients = await db.insert(clients).values(testClients).returning();
    console.log(`✅ Successfully created ${insertedClients.length} test clients\n`);

    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Create consultations for each client
    const consultationTypes = ['initial', 'follow-up', 'online'];
    const consultationTimes = ['09:00', '11:00', '14:00', '16:00', '18:00'];
    
    console.log('📅 Creating consultations for today...');
    
    for (const client of insertedClients) {
      const clientConsultations = [];
      
      // Create 3 consultations for each client
      for (let i = 0; i < 3; i++) {
        const consultationType = consultationTypes[i % consultationTypes.length];
        const consultationTime = consultationTimes[i % consultationTimes.length];
        
        clientConsultations.push({
          client_id: client.id,
          consultation_date: new Date(todayString + 'T' + consultationTime + ':00'),
          consultation_time: consultationTime,
          consultation_type: consultationType,
          notes: `${consultationType === 'initial' ? 'İlk görüşme' : consultationType === 'follow-up' ? 'Kontrol görüşmesi' : 'Online görüşme'} - ${client.name} için test randevusu`,
          status: 'scheduled',
          created_by: dietitianId,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      
      // Insert consultations for this client
      const insertedConsultations = await db.insert(consultations).values(clientConsultations).returning();
      console.log(`✅ Created ${insertedConsultations.length} consultations for ${client.name}`);
    }

    console.log('\n🎉 Test data creation completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${insertedClients.length} test clients created`);
    console.log(`   - ${insertedClients.length * 3} consultations created for today (${todayString})`);
    console.log(`   - All assigned to dietitian: ${dietitians[0].first_name} ${dietitians[0].last_name} (ID: ${dietitianId})`);

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    process.exit(0);
  }
}

createTestClientsAndConsultations(); 