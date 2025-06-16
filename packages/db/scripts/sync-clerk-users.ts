import { Clerk } from '@clerk/clerk-sdk-node';
import { db } from '../src';
import { users } from '../src/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY environment variable is not set');
}

// Initialize Clerk with your secret key
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function syncClerkUsers() {
  try {
    // Get all users from Clerk
    const clerkUsers = await clerk.users.getUserList();
    console.log(`Found ${clerkUsers.length} users in Clerk`);

    // Sync each user to our database
    for (const clerkUser of clerkUsers) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        console.log(`Skipping user ${clerkUser.id} - no email found`);
        continue;
      }

      try {
        // Check if user exists in our database
        const existingUser = await db.query.users.findFirst({
          where: eq(users.clerkId, clerkUser.id),
        });

        if (!existingUser) {
          console.log(`Creating new user for ${email}`);
          // Create new user
          await db.insert(users).values({
            clerk_id: clerkUser.id,
            email: email,
            role: 'subscriber_basic',
          });
          console.log(`Successfully created user for ${email}`);
        } else {
          console.log(`User ${email} already exists`);
        }
      } catch (error) {
        console.error(`Error processing user ${email}:`, error);
        continue; // Continue with next user even if one fails
      }
    }

    console.log('User sync completed successfully!');
  } catch (error) {
    console.error('Error syncing users:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await db.queryClient.end();
  }
}

syncClerkUsers(); 