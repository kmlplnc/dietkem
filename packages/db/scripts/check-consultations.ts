import { db } from '../src';
import { consultations } from '../schema';

async function checkConsultations() {
  try {
    console.log('🔍 Checking consultations in database...\n');
    
    const allConsultations = await db.select().from(consultations);
    
    console.log(`📊 Total consultations: ${allConsultations.length}\n`);
    
    allConsultations.forEach((consultation, index) => {
      console.log(`--- Consultation ${index + 1} ---`);
      console.log(`ID: ${consultation.id}`);
      console.log(`Client ID: ${consultation.client_id}`);
      console.log(`Date: ${consultation.consultation_date}`);
      console.log(`Time: ${consultation.consultation_time}`);
      console.log(`Type: ${consultation.consultation_type}`);
      console.log(`Status: ${consultation.status}`);
      console.log(`Created by: ${consultation.created_by}`);
      console.log(`Created at: ${consultation.created_at}`);
      console.log(`Updated at: ${consultation.updated_at}`);
      console.log('');
    });
    
    // Group by status
    const statusCounts = allConsultations.reduce((acc, consultation) => {
      acc[consultation.status] = (acc[consultation.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📈 Status Summary:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    // Check for past appointments
    const now = new Date();
    const pastAppointments = allConsultations.filter(consultation => 
      new Date(consultation.consultation_date) < now
    );
    
    console.log(`\n📅 Past appointments: ${pastAppointments.length}`);
    pastAppointments.forEach(appointment => {
      console.log(`  ID ${appointment.id}: ${appointment.consultation_date} (${appointment.status})`);
    });
    
    // Check for future appointments
    const futureAppointments = allConsultations.filter(consultation => 
      new Date(consultation.consultation_date) >= now
    );
    
    console.log(`\n📅 Future appointments: ${futureAppointments.length}`);
    futureAppointments.forEach(appointment => {
      console.log(`  ID ${appointment.id}: ${appointment.consultation_date} (${appointment.status})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking consultations:', error);
  } finally {
    process.exit(0);
  }
}

checkConsultations(); 