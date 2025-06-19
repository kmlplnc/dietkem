import { pgTable, serial, varchar, timestamp, integer, decimal, text, boolean } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  gender: varchar('gender', { length: 50 }),
  birth_date: timestamp('birth_date'),
  height_cm: decimal('height_cm', { precision: 5, scale: 2 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  notes: text('notes'),
  diseases: text('diseases'),        // JSON stringified array (string[])
  allergies: text('allergies'),      // JSON stringified array (string[])
  medications: text('medications'),  // JSON stringified array (string[])
  has_active_plan: boolean('has_active_plan').default(false),
  status: varchar('status', { length: 10 }).notNull().default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  activity_level: varchar('activity_level', { length: 32 }),
}); 