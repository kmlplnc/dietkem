import { db } from '../src';
import { consultations, clients } from '../schema';
import { eq, inArray } from 'drizzle-orm';

async function fixClientConsultations() {
  try {
    console.log('🔧 Fixing client consultations...\n');

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
    
    console.log('📋 Found test clients:');
    testClients.forEach(client => {
      console.log(`   - ID: ${client.id}, Name: ${client.name}, Email: ${client.email}`);
    });

    // Tüm görüşmeleri al
    const allConsultations = await db.select().from(consultations);
    
    console.log(`\n📊 Total consultations: ${allConsultations.length}`);
    
    // Test client ID'lerini al
    const testClientIds = testClients.map(c => c.id);
    
    // Test client'lara ait görüşmeleri filtrele
    const testConsultations = allConsultations.filter(c => testClientIds.includes(c.client_id));
    
    console.log(`📊 Test client consultations: ${testConsultations.length}`);
    
    // Her görüşmeyi kontrol et ve düzelt
    let fixedCount = 0;
    
    for (const consultation of testConsultations) {
      // Görüşmenin notlarında hangi danışanın adı geçiyor?
      const notes = consultation.notes || '';
      
      // Notlarda geçen danışan adını bul
      let correctClientId = null;
      
      for (const client of testClients) {
        if (notes.includes(client.name)) {
          correctClientId = client.id;
          break;
        }
      }
      
      // Eğer client_id yanlışsa düzelt
      if (correctClientId && correctClientId !== consultation.client_id) {
        console.log(`🔧 Fixing consultation ${consultation.id}:`);
        console.log(`   - Current client_id: ${consultation.client_id}`);
        console.log(`   - Correct client_id: ${correctClientId}`);
        console.log(`   - Notes: ${notes}`);
        
        // Görüşmeyi güncelle
        await db
          .update(consultations)
          .set({ 
            client_id: correctClientId,
            updated_at: new Date()
          })
          .where(eq(consultations.id, consultation.id));
        
        fixedCount++;
        console.log(`   ✅ Fixed!`);
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} consultations!`);
    
    // Sonucu kontrol et
    console.log('\n📋 Final check:');
    for (const client of testClients) {
      const clientConsultations = await db
        .select()
        .from(consultations)
        .where(eq(consultations.client_id, client.id));
      
      console.log(`   - ${client.name} (ID: ${client.id}): ${clientConsultations.length} consultations`);
    }

  } catch (error) {
    console.error('❌ Error fixing consultations:', error);
  } finally {
    process.exit(0);
  }
}

fixClientConsultations(); 