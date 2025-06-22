import { db } from '../src';
import { consultations } from '../schema';
import { eq, sql } from 'drizzle-orm';

async function completeSomeConsultations() {
  try {
    console.log('🔄 Completing some test consultations...\n');

    // Bugünkü randevulardan ilk 5'ini completed yap
    const today = new Date().toISOString().split('T')[0];
    
    // Bugünkü randevuları bul (SQL ile)
    const result = await db.execute(sql`
      SELECT id, consultation_time FROM consultations 
      WHERE DATE(consultation_date) = ${today}
      ORDER BY consultation_time
      LIMIT 5
    `);
    // Farklı Drizzle sürümleri için rows'u bul
    let rows = [];
    if (Array.isArray(result)) {
      // drizzle-orm@0.29+ için
      rows = result[0]?.rows || [];
    } else if (result && Array.isArray(result.rows)) {
      // eski drizzle-orm için
      rows = result.rows;
    } else if (Array.isArray(result)) {
      rows = result;
    }

    console.log(`📅 Found ${rows.length} consultations for today`);

    for (const consultation of rows) {
      await db.update(consultations)
        .set({
          status: 'completed',
          updated_at: new Date()
        })
        .where(eq(consultations.id, consultation.id));
      
      console.log(`✅ Completed consultation ${consultation.id} (${consultation.consultation_time})`);
    }

    console.log(`\n🎉 Successfully completed ${rows.length} consultations!`);
    console.log('Now these consultations will NOT appear in "Bugünkü Görüşmeler" section.');

  } catch (error) {
    console.error('❌ Error completing consultations:', error);
  } finally {
    process.exit(0);
  }
}

completeSomeConsultations(); 