import { db } from '../src';
import { consultations } from '../schema';
import { eq, In } from 'drizzle-orm';

async function updatePastConsultations() {
  try {
    console.log('🔄 Updating past consultations to completed status...\n');

    // 1. Fetch all scheduled consultations
    const scheduledConsultations = await db
      .select()
      .from(consultations)
      .where(eq(consultations.status, 'scheduled'));

    if (scheduledConsultations.length === 0) {
      console.log('✅ No scheduled consultations to check.');
      process.exit(0);
    }
    
    console.log(`🔍 Found ${scheduledConsultations.length} scheduled consultations. Checking which ones are past.`);

    // 2. Filter them in TypeScript to determine which ones to update
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    const consultationsToUpdateIds: number[] = [];

    for (const c of scheduledConsultations) {
      // Combine date and time string to create a full Date object
      const [hours, minutes] = c.consultation_time.split(':').map(Number);
      const appointmentDateTime = new Date(c.consultation_date);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      // Check if it's in the past
      if (appointmentDateTime > now) {
        continue; // Not in the past yet, skip
      }

      let shouldUpdate = false;
      // It is in the past, now apply the logic
      if (c.consultation_type === 'online') {
        // If online, check if it's been more than an hour since it started
        const oneHourAfterAppointment = new Date(appointmentDateTime.getTime() + oneHour);
        if (now > oneHourAfterAppointment) {
          shouldUpdate = true;
        }
      } else {
        // If not online, and it's in the past, update it
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        consultationsToUpdateIds.push(c.id);
      }
    }
    
    console.log(`📅 Found ${consultationsToUpdateIds.length} past consultations to update to 'completed'.`);
    
    if (consultationsToUpdateIds.length === 0) {
      console.log('✅ No past consultations to update right now.');
      process.exit(0);
    }
    
    // 3. Update all identified consultations in a single query
    console.log(`🔄 Updating IDs: ${consultationsToUpdateIds.join(', ')}`);
    await db
      .update(consultations)
      .set({ 
        status: 'completed',
        updated_at: new Date()
      })
      .where(In(consultations.id, consultationsToUpdateIds));
    
    console.log('\n🎉 All applicable past consultations updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating consultations:', error);
  } finally {
    process.exit(0);
  }
}

updatePastConsultations(); 