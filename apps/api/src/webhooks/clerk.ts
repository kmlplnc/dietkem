import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, ...attributes } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      return new Response('No email found', { status: 400 });
    }

    try {
      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, id),
      });

      if (existingUser) {
        // Update existing user
        await db.update(users)
          .set({
            email: primaryEmail,
            updated_at: new Date(),
          })
          .where(eq(users.clerkId, id));
      } else {
        // Create new user
        await db.insert(users).values({
          clerk_id: id,
          email: primaryEmail,
          role: 'subscriber_basic',
        });
      }

      return new Response('User synced successfully', { status: 200 });
    } catch (error) {
      console.error('Error syncing user:', error);
      return new Response('Error syncing user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Delete user from database
      await db.delete(users)
        .where(eq(users.clerkId, id));

      return new Response('User deleted successfully', { status: 200 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
} 