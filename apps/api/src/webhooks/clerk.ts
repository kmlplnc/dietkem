import { Webhook } from 'svix';
import { Request, Response } from 'express';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';

export async function handleClerkWebhook(req: Request, res: Response) {
  // Get the headers
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occurred -- no svix headers' });
  }

  // Get the body
  const payload = req.body;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Error occurred' });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, ...attributes } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      return res.status(400).json({ error: 'No email found' });
    }

    try {
      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.clerk_id, id),
      });

      if (existingUser) {
        // Update existing user
        await db.update(users)
          .set({
            email: primaryEmail,
            updated_at: new Date(),
          })
          .where(eq(users.clerk_id, id));
      } else {
        // Create new user
        await db.insert(users).values({
          clerk_id: id,
          email: primaryEmail,
          role: 'subscriber_basic',
        });
      }

      return res.status(200).json({ message: 'User synced successfully' });
    } catch (error) {
      console.error('Error syncing user:', error);
      return res.status(500).json({ error: 'Error syncing user' });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Delete user from database
      await db.delete(users)
        .where(eq(users.clerk_id, id));

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Error deleting user' });
    }
  }

  return res.status(200).json({ message: 'Webhook received' });
} 