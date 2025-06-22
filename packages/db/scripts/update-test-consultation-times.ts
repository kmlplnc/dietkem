import { db } from '../src';
import { consultations, clients } from '../schema';
import { eq, inArray } from 'drizzle-orm';

async function updateConsultationTimes() {
  // Saatler: 22:00, 22:30, 23:00, 23:30, 23:59
  const newTimes = ['22:00', '22:30', '23:00', '23:30', '23:59'];
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

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

  // Bugünkü tüm test danışanlarının randevularını bul
  const allConsultations = await db.select().from(consultations)
    .where(
      inArray(consultations.client_id, testClientIds)
    );

  // Sadece bugünkü randevuları filtrele
  const todaysConsultations = allConsultations.filter(c => {
    const date = new Date(c.consultation_date);
    return date.toISOString().split('T')[0] === todayString;
  });

  // Her danışanın bugünkü randevularını sırayla güncelle
  let updatedCount = 0;
  for (let i = 0; i < todaysConsultations.length; i++) {
    const c = todaysConsultations[i];
    const newTime = newTimes[i % newTimes.length];
    const newDate = todayString + 'T' + newTime + ':00';
    await db.update(consultations)
      .set({
        consultation_time: newTime,
        consultation_date: new Date(newDate),
        updated_at: new Date(),
      })
      .where(eq(consultations.id, c.id));
    updatedCount++;
    console.log(`Updated consultation ${c.id} to ${newTime}`);
  }

  console.log(`\n✅ Updated ${updatedCount} consultations to be between 22:00 and 00:00.`);
  process.exit(0);
}

updateConsultationTimes(); 