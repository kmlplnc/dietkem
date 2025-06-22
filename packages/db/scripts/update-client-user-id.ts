import { db } from '../src';
import { clients, users } from '../schema';
import { eq } from 'drizzle-orm';

async function updateClientUserId() {
  try {
    console.log('🔍 Updating client user_id...\n');
    
    // Önce kullanıcıları kontrol et
    const allUsers = await db.select().from(users);
    console.log(`📊 Total users: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    // İlk kullanıcıyı diyetisyen olarak kullan
    const dietitian = allUsers[0];
    console.log(`👨‍⚕️ Using dietitian: ${dietitian.name} (ID: ${dietitian.id})`);
    
    // Danışanları kontrol et
    const allClients = await db.select().from(clients);
    console.log(`📋 Total clients: ${allClients.length}`);
    
    if (allClients.length === 0) {
      console.log('No clients found in the database.');
      return;
    }

    // Danışanların mevcut user_id değerlerini göster
    console.log('\n📊 Current clients:');
    allClients.forEach(client => {
      console.log(`- ID: ${client.id}, Name: ${client.name}, user_id: ${client.user_id}`);
    });

    // user_id'si null olan danışanları güncelle
    const clientsToUpdate = allClients.filter(client => client.user_id === null);
    
    if (clientsToUpdate.length === 0) {
      console.log('\n✅ All clients already have user_id assigned.');
      return;
    }

    console.log(`\n🔄 Updating ${clientsToUpdate.length} clients...`);
    
    for (const client of clientsToUpdate) {
      await db.update(clients)
        .set({ user_id: dietitian.id })
        .where(eq(clients.id, client.id));
      
      console.log(`✅ Updated client ${client.name} (ID: ${client.id}) with user_id: ${dietitian.id}`);
    }

    console.log('\n🎉 All clients updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating client user_id:', error);
  } finally {
    process.exit(0);
  }
}

updateClientUserId(); 